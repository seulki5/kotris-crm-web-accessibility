#!/usr/bin/env node
/**
 * 페이지 루트 div(body-wrap*) → main 변환 및 aria-labelledby 보강
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.join(__dirname, '../src/app');

const PAGE_ROOT_RE = /<div\s+id=\{['"]([\w-]+)['"]\}\s+className=\{['"]([^'"]*body-wrap[^'"]*)['"]\}/g;
const PAGE_ROOT_RE_NO_ID = /<div\s+className=\{['"]([^'"]*body-wrap[^'"]*)['"]\}/g;

function walk(dir, files = []) {
	for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(full, files);
		else if (/page(Client)?\.js$/.test(entry.name)) files.push(full);
	}
	return files;
}

function inferVariant(block, offset) {
	const before = block.slice(Math.max(0, offset - 400), offset);
	if (/export function Mo|function Mo|Mo[A-Z]/.test(before)) return 'mo';
	if (/export function Dt|function Dt|Dt[A-Z]/.test(before)) return 'dt';
	return null;
}

function transform(content) {
	let changed = false;
	let next = content;

	// body-wrap 루트 div → main
	next = next.replace(PAGE_ROOT_RE, (match, id, className, offset) => {
		changed = true;
		const variant = inferVariant(next, offset);
		const aria = variant
			? ` aria-labelledby={'page-name-${variant}'}`
			: '';
		return `<main id={'${id}'} className={'${className}'}${aria}`;
	});

	// Dt/Mo 컴포넌트 경계 직전의 루트 닫는 태그
	next = next.replace(
		/(\t*)<\/div>(\r?\n\t*\)\r?\n\}\r?\n\r?\n\/\*\*\r?\n \* @description: (Mobile|Desktop))/g,
		(m, indent, rest) => {
			changed = true;
			return `${indent}</main>${rest}`;
		},
	);

	// 파일 마지막 export function 의 return 루트 (Mobile only 컴포넌트)
	next = next.replace(
		/(\t*)<\/div>(\r?\n\t*\)\r?\n\}\s*)$/g,
		(m, indent, rest, offset, str) => {
			const tail = str.slice(Math.max(0, offset - 800), offset);
			if (!/<main id=/.test(tail) || /<\/main>/.test(tail.slice(tail.lastIndexOf('<main')))) {
				return m;
			}
			changed = true;
			return `${indent}</main>${rest}`;
		},
	);

	// aria-labelledby 있는 div id 루트 → main
	next = next.replace(
		/<div\s+id=\{['"]([\w-]+)['"]\}\s+className=\{['"]([^'"]+)['"]\}\s+aria-labelledby=\{['"]page-name-(dt|mo)['"]\}/g,
		(match) => {
			changed = true;
			return match.replace('<div', '<main');
		},
	);

	// div→main 변환 후 남은 짝: <main ...> ... </div> before );
	next = next.replace(
		/(<main[^>]*>[\s\S]*?)(\t*)<\/div>(\r?\n\t*\))/g,
		(m, open, indent, close, offset, str) => {
			const fromMain = str.lastIndexOf('<main', offset);
			if (fromMain === -1) return m;
			const segment = str.slice(fromMain, offset + m.length);
			const opens = (segment.match(/<main\b/g) || []).length;
			const closesMain = (segment.match(/<\/main>/g) || []).length;
			if (opens <= closesMain) return m;
			changed = true;
			return `${open}${indent}</main>${close}`;
		},
	);

	return {content: next, changed};
}

const files = walk(APP_ROOT);
let updated = 0;

for (const file of files) {
	let content = fs.readFileSync(file, 'utf8');
	const original = content;
	const result = transform(content);
	content = result.content;
	if (content !== original) {
		fs.writeFileSync(file, content);
		updated++;
		console.log('updated:', path.relative(APP_ROOT, file));
	}
}

console.log(`\nDone. ${updated} file(s) updated.`);
