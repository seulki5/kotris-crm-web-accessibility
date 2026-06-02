import Textarea from '../components/common/Textarea'

export default {
    title: 'Components/Textarea',
    component: Textarea,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        status: {
            control: 'radio',
            options: ['default', 'warning', 'success', 'caution'],
            description: '텍스트영역 상태',
            table: {
                type: { summary: 'default | warning | success | caution' },
                defaultValue: { summary: 'default' }
            }
        },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
            description: '텍스트영역 크기',
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
        direction: {
            control: 'radio',
            options: ['vertical', 'horizontal'],
            description: '제목 위치',
            table: {
                type: { summary: 'vertical | horizontal' },
                defaultValue: { summary: 'vertical' }
            }
        },
        
        maxLength: {
            control: 'number',
            description: '최대 입력 길이',
            table: {
                type: { summary: 'number' }
            }
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
            table: {
                type: { summary: 'boolean' }
            }
        },
        
        onChange: {
            control: false,
            description: '값 변경 시 호출되는 함수',
            table: {
                type: { summary: 'function' }
            }
        }
    },
}

// Default 사이즈
export const Default = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        direction: 'vertical',
        status: 'default'
    },
}

// 사이즈
export const Size = {
    render: () => {
        return (
            <div className="flex flex-col gap-4">
                <Textarea size="sm" placeholder="Small (sm)" message="텍스트를 입력해주세요" />
                <Textarea size="md" placeholder="Medium (md)" message="텍스트를 입력해주세요" />
                <Textarea size="lg" placeholder="Large (lg)" message="텍스트를 입력해주세요" />
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
        message: '오류가 발생했습니다',
    },
}

// 성공 상태
export const Success = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        status: 'success',
        message: '성공적으로 등록되었습니다',
    },
}

// 경고 상태
export const Caution = {
    args: {
        size: 'md',
        placeholder: 'placeholder',
        status: 'caution',
        message: '입력 내용을 확인해주세요',
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
