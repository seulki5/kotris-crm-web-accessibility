import moment from "moment";

// 유효성 규칙명
export const VALIDATE_RULES = {
	MIN_LENGTH: 'minLength',
	MAX_LENGTH: 'maxLength',
	SPECIAL_CHAR: 'specialChar',
	NUMERIC: 'numeric',
	NUMERIC_AND_ALPHA: 'numericAndAlpha',
	ALPHA: 'alpha',
	EMAIL: 'email',
	PHONE: 'phone',
	MAX_AGE: 'overAge',
	MIN_AGE: 'underAge',
	CARD_NO: 'cardNo',
	FILE_MIN_LENGTH: 'fileMinLength',
	FILE_MAX_LENGTH: 'fileMaxLength',
	PASSWORD: 'password',
	BLANK: 'blank'
}

// 유효성 검사
export function validate(params, ruleMap) {
	let result = {};

	for (const key in ruleMap) {
		const value = params[key] ?? '';
		const rules = ruleMap[key];
		let errors = [];

		rules?.forEach(rule => {
			if(value.length < 1) {
				errors.push(`입력 값이 비었습니다.`);
			}

			switch (rule.type) {
				case VALIDATE_RULES.BLANK:
					if(!rule.value) break;
					if(value.length < rule.value) {
						errors.push(`입력 값이 비었습니다.`);
					}
					break;
				case VALIDATE_RULES.MIN_LENGTH:
					if(!rule.value) break;
					if(value.length < rule.value) {
						errors.push(`최소 ${rule.value}자 이상이어야 합니다.`);
					}
					break;
				case VALIDATE_RULES.MAX_LENGTH:
					if(!rule.value) break;
					if(value.length > rule.value) {
						errors.push(`최대 ${rule.value}자 이하이어야 합니다.`);
					}
					break;
				case VALIDATE_RULES.SPECIAL_CHAR:
					if (!/^[!@#$%^&*(),.?":{}|<>]+$/.test(value)) {
						errors.push(`특수문자만 입력해야 합니다`);
					}
					break
				case VALIDATE_RULES.NUMERIC:
					if (!/^[0-9]+$/.test(value)) {
						errors.push(`숫자만 입력해야 합니다`)
					}
					break

				case VALIDATE_RULES.ALPHA:
					if (!/^[a-zA-Z가-힣]+$/.test(value)) {
						errors.push(`문자만 입력해야 합니다`)
					}
					break
				case VALIDATE_RULES.NUMERIC_AND_ALPHA:
					if (!/^[0-9a-zA-Z가-힣]+$/.test(value)) {
						errors.push(`문자와 숫자만 입력해야 합니다`)
					}
					break
				case VALIDATE_RULES.EMAIL:
					if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
						errors.push(`이메일 형식이 올바르지 않습니다`)
					}
					break

				case VALIDATE_RULES.PHONE:
					if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(value)) {
						errors.push(`휴대폰 번호 형식이 올바르지 않습니다`)
					}
					break
				case VALIDATE_RULES.MIN_AGE:
					if(!rule.value) break;
					var age = value;
					var diff = moment().diff(moment(age, 'YYYYMMDD'), 'years');
					if(!diff || diff < rule.value) {
						errors.push(`최소 연령(만 ${rule.value}세) 조건에 부합하지 않습니다.`);
					}
					break;
				case VALIDATE_RULES.MAX_AGE:
					if(!rule.value) break;
					var age = value;
					var diff = moment().diff(moment(age, 'YYYYMMDD'), 'years');
					if(!diff || diff > rule.value) {
						errors.push(`최대 연령(만 ${rule.value}세) 조건에 부합하지 않습니다.`);
					}
					break;
				case VALIDATE_RULES.CARD_NO:
					var num = value.replace('-', '');
					if (!/^[0-9]+$/.test(num)) {
						errors.push(`숫자만 입력해야 합니다`)
					}
					if(num.length !== 16) {
						errors.push(`카드 번호를 다시 확인해주세요.`);
					}
					break;
				case VALIDATE_RULES.FILE_MIN_LENGTH:
					if(!rule.value) break;
					if(value.length < rule.value) {
						errors.push(`파일은 최소 ${rule.value}개 첨부하여야 합니다.`);
					}
					break;
				case VALIDATE_RULES.FILE_MAX_LENGTH:
					if(!rule.value) break;
					if(value.length > rule.value) {
						errors.push(`파일은 최대 ${rule.value}개 첨부 가능합니다.`);
					}
					break;
				case VALIDATE_RULES.PASSWORD:
					const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{9,20}$/;
					if (!regex.test(value)) {
						errors.push(`영문, 숫자, 특수문자(!,@,#,$,%,^,&,* 중 하나 이상)의 조합으로 9~20자를 입력해주세요.`);
					}
					break
			}
		})

		if(errors.length > 0) {
			result[key] = errors[0]
		}
	}

	return result;
}

// input 상태 체크
export function fncValiState (key, errors) {
	if(!key || !errors) return 'default';
	if(errors[key]) return 'warning';
	return 'default';
}

// 필수값 입력 체크
export function fncAllDefined(arr) {
	return Array.isArray(arr) && arr.every(v => !!v);
}
