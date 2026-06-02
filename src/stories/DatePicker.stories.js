import { DatePicker, RangePicker } from '@components/common/DatePicker'

export default {
    title: 'Components/DatePicker',
    component: DatePicker,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '날짜 선택을 위한 DatePicker 컴포넌트입니다. hover, active, disabled 상태를 지원합니다.'
            }
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="flex flex-col gap-4 min-h-[450px]">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: '사이즈',
            table: {
                type: { summary: 'sm | md | lg' },
                defaultValue: { summary: 'md' }
            }
        },
        state: {
            control: 'radio',
            options: ['default', 'disabled'],
            description: '상태',
            table: {
                type: { summary: 'default | disabled' },
                defaultValue: { summary: 'default' }
            }
        },
        placeholder: {
            control: 'text',
            description: 'placeholder 텍스트',
            table: {
                defaultValue: { summary: 'placeholder' },
                type: { summary: 'string' }
            }
        },
        title: {
            control: 'text',
            description: '제목',
            table: {
                type: { summary: 'string' }
            }
        },
        direction: {
            control: 'radio',
            options: ['vertical', 'horizontal'],
            description: '레이아웃 방향',
            table: {
                type: { summary: 'vertical | horizontal' },
                defaultValue: { summary: 'vertical' }
            }
        },
        essential: {
            control: 'boolean',
            description: '필수 여부',
            table: {
                type: { summary: 'boolean' }
            }
        },
        onChange: {
            control: false,
            description: '날짜 선택 시 호출되는 함수',
            table: {
                type: { summary: 'function' }
            }
        },
    },
}

// Small 사이즈
export const Small = {
    args: {
        size: 'sm',
    },
}

// Medium 사이즈
export const Medium = {
    args: {
        size: 'md',
    },
}

// Large 사이즈
export const Large = {
    args: {
        size: 'lg',
    },

}
//제목이 있는 스토리
export const WithVerticalTitle = {
    args: {
        size: 'lg',
        title: '제목',
        direction: 'vertical',
        essential: true,
    },

}

export const WithHorizontalTitle = {
    args: {
        size: 'lg',
        title: '제목',
        direction: 'horizontal',
        essential: true,
    },

}

// Disabled 상태
export const Disabled = {
    args: {
        size: 'md',
        state: 'disabled',
    },
}

// Range Picker 예시
export const Range = {
    render: () => (
        <RangePicker
            size="md"
            startPlaceholder="YYYY-MM-DD"
            endPlaceholder="YYYY-MM-DD"
            onChange={(startDate, endDate) => {
                alert(`Start Date: ${startDate} / End Date: ${endDate}`)
            }}
        />
    ),
}

// 제목이 있는 스토리
export const WithRangeVerticalTitle = {
    render: () => (
        <RangePicker
            size="md"
            startPlaceholder="YYYY-MM-DD"
            endPlaceholder="YYYY-MM-DD"
            onChange={(startDate, endDate) => {
                alert(`Start Date: ${startDate} / End Date: ${endDate}`)
            }}
            rangeTitle="제목"
            direction="vertical"
            essential
        />
    ),
}

// 제목이 있는 스토리
export const WithRangeHorizontalTitle = {
    render: () => (
        <RangePicker
            size="md"
            startPlaceholder="YYYY-MM-DD"
            endPlaceholder="YYYY-MM-DD"
            onChange={(startDate, endDate) => {
                alert(`Start Date: ${startDate} / End Date: ${endDate}`)
            }}
            rangeTitle="제목"
            direction="horizontal"
            essential
        />
    ),
}
