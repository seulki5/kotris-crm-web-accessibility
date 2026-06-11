import ToggleSwitch from '@components/common/ToggleSwitch'

const meta = {
    title: 'Components/ToggleSwitch',
    component: ToggleSwitch,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'radio',
            options: ['sm', 'md'],
            description: 'Select 크기',
            defaultValue: 'sm',
            table: {
                type: { summary: 'sm | md' },
                defaultValue: { summary: 'sm' }
            }
        },
        label: {
            control: 'text',
            description: '토글 레이블',
            table: {
                type: { summary: 'string' }
            }
        },
        isChecked: {
            control: 'boolean',
            description: '선택 상태',
            table: {
                type: { summary: 'boolean' }
            }
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
            table: {
                type: { summary: 'boolean' }
            }
        },
    }
}

export default meta

// 기본 토글
export const Default = {
    args: {
        size: 'md',
        label: '레이블'
    }
}

// 선택된 토글
export const Checked = {
    args: {
        ...Default.args,
        isChecked: true
    }
}

// 비활성화된 토글
export const Disabled = {
    args: {
        ...Default.args,
        disabled: true
    }
}

// 선택되고 비활성화된 토글
export const CheckedAndDisabled = {
    args: {
        ...Default.args,
        isChecked: true,
        disabled: true
    }
}
