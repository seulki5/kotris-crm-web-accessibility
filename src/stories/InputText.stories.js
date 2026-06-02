import InputText from '../components/common/InputText'
import {Lock, Null} from '@assets/icons/Svgs'

export default {
    title: 'Components/InputText',
    component: InputText,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        status: {
            control: 'radio',
            options: ['default', 'warning', 'success', 'caution'],
            description: '입력 필드 상태',
            table: {
                type: { summary: 'default | warning | success | caution' },
                defaultValue: { summary: 'default' }
            }
        },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
            description: '입력 필드 크기',
            table: {
                type: { summary: 'sm | md | lg' },
                defaultValue: { summary: 'md' }
            }
        },
        value: {
            control: 'text',
            description: '입력 값',
            table: {
                type: { summary: 'string' }
            }
        },
        message: {
            control: 'text',
            description: '상태 메시지',
            table: {
                type: { summary: 'string' }
            }
        },
        placeholder: {
            control: 'text',
            description: 'placeholder 텍스트',
            table: {
                type: { summary: 'string' }
            }
        },
        title: {
            control: 'text',
            description: '입력 필드 제목',
            table: {
                type: { summary: 'string' }
            }
        },
        essential: {
            control: 'boolean',
            description: '필수 여부',
            table: {
                type: { summary: 'boolean' }
            }
        },
        icon: {
            control: 'boolean',
            description: '우측 아이콘',
            mapping: {
                true: <Lock />,
                false: undefined
            },
            table: {
                type: { summary: 'icon' }
            }
        },
        onClickIcon: {
            control: false,
            description: '우측 아이콘 클릭시 호출되는 함수',
            table: {
                type: { summary: 'function' },
                defaultValue: { summary: "-" }
            }
        },
        props: {
            control: false,
            description: 'input 태그에 직접 전달할 수 있는 모든 속성들',
            table: {
                type: { summary: 'Object' }
            }
        },
        onChange: {
            control: false,
            description: '값 변경 시 호출되는 함수',
            table: {
                type: { summary: 'function' },
                defaultValue: { summary: "-" }
            }
        },
        dataOnly: {
            control: 'boolean',
            description: '데이터만 표시 유무',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 유무',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        fitWidth: {
            control: 'boolean',
            description: '가로길이 100% 유무',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        inputType: {
            control: 'radio',
            options: ['text', 'password'],
            description: 'input 타입',
            table: {
                type: { summary: 'text | password' },
                defaultValue: { summary: 'text' }
            }
        },
    },
}

export const Default = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        status: 'default',
        direction: 'vertical'
    },
}

// size 예시
export const Sizes = {
    render: () => {
        return (
            <div className="flex flex-col gap-4">
                <InputText size="sm" placeholder="placeholder" />
                <InputText size="md" placeholder="placeholder" />
                <InputText size="lg" placeholder="placeholder" />
            </div>
        )
    }
}

// 에러 상태
export const Warning = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        status: 'warning',
        message: '오류메세지가 표시됩니다',
    },
}

// 성공 상태
export const Success = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        status: 'success',
        message: '성공메세지가 표시됩니다',
    },
}

// 경고 상태
export const Caution = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        status: 'caution',
        message: '경고메세지가 표시됩니다',
    },
}

// 비활성화 상태
export const Disabled = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        disabled: true,
    },
}

// 제목 위지 직렬
export const WithVerticalTitle = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        value: '입력된 텍스트',
        title: '제목',
    },
}

// 제목 위치 수평
export const WithHorizontalTitle = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        value: '입력된 텍스트',
        direction: 'horizontal',
        title: '제목',
    },
}

// 아이콘이 있는 상태
export const WithIcon = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        icon: <Null />,
    },
}

// 데이터만 표기
export const DataOnly = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        value: '입력된 텍스트',
        dataOnly: true,
    },
}
