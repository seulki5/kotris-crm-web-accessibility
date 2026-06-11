import React, {useLayoutEffect, useRef, useState} from "react";
import PropTypes from "prop-types";

Tooltip.propTypes = {
	size: PropTypes.string,
	text: PropTypes.string,
	direction: PropTypes.string,
	position: PropTypes.string,
};
export default function Tooltip({
    size = 'md',
    text = '내용을 입력하세요.',
    direction = 'up', // up, down
    position = 'center', //start, center, end
}) {
	
	const sizesBySize = {
		sm: {
			fontSize: 'text-body-2xs',
			paddingX: 16,
			scale: 1,
		},
		md: {
			fontSize: 'text-body-xs',
			paddingX: 24,
			scale: 1.3,
		},
	};
	const cornerRadius = 4;
	const tailSize = 6 * sizesBySize[size].scale;
	const paddingX = sizesBySize[size].paddingX;
	const paddingY = 16;
	const fontColor = '#FFFFFF';
	const bubbleColor = '#212327F5';
	
	const textRef = useRef(null);
	
	const [textWidth, setTextWidth] = useState(0);
	const [textHeight, setTextHeight] = useState(0);
	
	useLayoutEffect(() => {
		if (textRef.current) {
			const bbox = textRef.current.getBBox();
			setTextWidth(bbox.width);
			setTextHeight(bbox.height);
		}
	}, [text]);
	
	const innerWidth = textWidth + paddingX;
	const innerHeight = textHeight + paddingY;
	
	let w = innerWidth;
	let h = innerHeight;
	let tailPath = '';
	let textX = w / 2;
	let textY = h / 2;
	
	// tail 기준점
	const getTailX = () => {
		if (position === 'start') return tailSize + 12;
		if (position === 'end') return w - tailSize - 12;
		return w / 2;
	};
	
	switch (direction) {
		case 'up': {
			h = innerHeight + tailSize;
			textY = tailSize + innerHeight / 2;
			
			const tx = getTailX();
			const baseY = tailSize;
			const tipY = 0;
			const flatHalf = 1.7;
			
			tailPath = `
		      M ${tx - tailSize},${baseY}
		      Q ${tx - flatHalf},${tipY} ${tx - flatHalf},${tipY}
		      L ${tx + flatHalf},${tipY}
		      Q ${tx + flatHalf},${tipY} ${tx + tailSize},${baseY}
		      Z
		    `;
			break;
		}
		
		case 'down': {
			h = innerHeight + tailSize;
			textY = innerHeight / 2;
			
			const tx = getTailX();
			const baseY = h - tailSize;
			const tipY = h;
			const curveDepth = tailSize * 0;
			const flatHalf = 1.7;
			
			tailPath = `
		      M ${tx - tailSize},${baseY}
		      Q ${tx - flatHalf},${tipY + curveDepth} ${tx - flatHalf},${tipY}
		      L ${tx + flatHalf},${tipY}
		      Q ${tx + flatHalf},${tipY + curveDepth} ${tx + tailSize},${baseY}
		      Z
		    `;
			break;
		}
		
		default:
			break;
	}
	
	return (
		<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
			<rect
				x={0}
				y={direction === 'up' ? tailSize : 0}
				width={w}
				height={innerHeight}
				rx={cornerRadius}
				ry={cornerRadius}
				fill={bubbleColor}
			/>
			<path d={tailPath} fill={bubbleColor} />
			<text
				ref={textRef}
				x={textX}
				y={textY}
				dy={"0.1em"}
				fill={fontColor}
				textAnchor={"middle"}
				dominantBaseline={"middle"}
				className={`${sizesBySize[size].fontSize} font-normal`}
			>
				{text}
			</text>
		</svg>
	);
}
