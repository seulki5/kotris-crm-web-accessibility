import React from 'react'

// components
import Button from '@components/common/Button';

// styles
import {Null} from '@assets/icons/Svgs';

// meta
const meta = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        theme: {
            control: 'radio',
            options: ['primary', 'secondary', 'tertiary', 'textOnly'],
            description: '버튼 테마',
            defaultValue: 'primary',
            table: {
                type: { summary: 'primary | secondary | tertiary | textBtn' },
                defaultValue: { summary: 'primary' }
            }
        },
        size: {
            control: 'radio',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
            description: '버튼 크기',
            defaultValue: 'md',
            table: {
                type: { summary: 'xs |sm | md | lg | xl' },
                defaultValue: { summary: 'md' }
            }
        },
        text: {
            control: 'text',
            description: '버튼 텍스트',
            defaultValue: '버튼명',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        disabled: {
            control: 'boolean',
            description: '버튼 비활성화 여부',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        icon: {
            control: 'boolean',
            description: '아이콘',
            defaultValue: false,
            mapping: {
                true: <Null />,
                false: undefined
            },
            table: {
                type: { summary: 'icon' },
            }
        },
        iconPosition: {
            control: 'select',
            options: ['left', 'center', 'right'],
            description: '아이콘 위치',
            defaultValue: null,
            table: {
                type: { summary: 'left | center | right' },
                defaultValue: { summary: 'null' }
            }
        },
        onClick: {
            description: '버튼 클릭시 호출 되는 함수',
            control: false,
            table: {
                type: { summary: 'function' }
            }
        },
        customStyle: {
            description: '사용자 정의 스타일',
            control: false,
            table: {
                type: { summary: 'tailwind CSS 문법 사용' }
            }
        }
    },
}
export default meta

// 기본 버튼
export const Default = {
    args: {
        theme: 'primary',
        size: 'md',
        text: '버튼명',
        disabled: false,
    },
    render: (args) => <Button {...args} />
}

// 사이즈 예시
export const Primary = {
    render: () => (
        <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-end">
                <Button
                    theme="primary"
                    text="버튼명"
                    size="xs"
                />
                <Button
                    theme="primary"
                    text="버튼명"
                    size="sm"
                />
                <Button
                    theme="primary"
                    text="버튼명"
                    size="md"
                    icon={<Null />}
                    iconPosition={"left"}
                />
                <Button
                    theme="primary"
                    text="버튼명"
                    size="lg"
                    icon={<Null />}
                    iconPosition={"right"}
                />
                <Button
                    theme="primary"
                    text="버튼명"
                    size="lg"
                    icon={<Null />}
                    iconPosition={"center"}
                />
            </div>
        </div>
    ),
}

// Secondary 버튼
export const Secondary = {
    render: () => (
        <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-end">
                <Button
                    theme="secondary"
                    text="버튼명"
                    size="xs"
                />
                <Button
                    theme="secondary"
                    text="버튼명"
                    size="sm"
                />
                <Button
                    theme="secondary"
                    text="버튼명"
                    size="md"
                    icon={<Null />}
                    iconPosition={"left"}
                />
                <Button
                    theme="secondary"
                    text="버튼명"
                    size="lg"
                    icon={<Null />}
                    iconPosition={"right"}
                />
                <Button
                    theme="secondary"
                    text="버튼명"
                    size="lg"
                    icon={<Null />}
                    iconPosition={"center"}
                />
            </div>
        </div>
    ),
}

// Tertiary 버튼
export const Tertiary = {
    render: () => (
        <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-end">
                <Button
                    theme="tertiary"
                    text="버튼명"
                    size="xs"
                />
                <Button
                    theme="tertiary"
                    text="버튼명"
                    size="sm"
                />
                <Button
                    theme="tertiary"
                    text="버튼명"
                    size="md"
                    icon={<Null />}
                    iconPosition={"left"}
                />
                <Button
                    theme="tertiary"
                    text="버튼명"
                    size="lg"
                    icon={<Null />}
                    iconPosition={"right"}
                />
                <Button
                    theme="tertiary"
                    text="버튼명"
                    size="lg"
                    icon={<Null />}
                    iconPosition={"center"}
                />
            </div>
        </div>
    ),
}

// Disabled 버튼
export const Disabled = {
    render: () => (
        <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-end">
                <Button
                    theme="secondary"
                    text="버튼명"
                    size="xs"
                    disabled
                />
                <Button
                    theme="secondary"
                    text="버튼명"
                    size="sm"
                    disabled
                />
                <Button
                    theme="secondary"
                    text="버튼명"
                    size="md"
                    icon={<Null />}
                    iconPosition={"left"}
                    disabled
                />
                <Button
                    theme="secondary"
                    text="버튼명"
                    size="lg"
                    icon={<Null />}
                    iconPosition={"right"}
                    disabled
                />
                <Button
                    theme="secondary"
                    text="버튼명"
                    size="lg"
                    icon={<Null />}
                    iconPosition={"center"}
                    disabled
                />
            </div>
        </div>
    ),
}

// Tertiary Text-on-light 버튼 (xs, xs 사이즈)
export const TextBtn = {
    render: () => (
        <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-end">
                <Button
                    theme="textOnly"
                    text="버튼명"
                    size="xs"
                />
                <Button
                    theme="textOnly"
                    text="버튼명"
                    size="sm"
                />
                <Button
                    theme="textOnly"
                    text="버튼명"
                    size="md"
                    icon={<Null />}
                    iconPosition={"left"}
                />
                <Button
                    theme="textOnly"
                    text="버튼명"
                    size="lg"
                    icon={<Null />}
                    iconPosition={"right"}
                />
            </div>
            <div className="flex gap-4 items-end">
                <Button
                    theme="textOnly"
                    text="버튼명"
                    size="xs"
                    disabled
                />
                <Button
                    theme="textOnly"
                    text="버튼명"
                    size="sm"
                    disabled
                />
                <Button
                    theme="textOnly"
                    text="버튼명"
                    size="md"
                    icon={<Null />}
                    iconPosition={"left"}
                    disabled
                />
                <Button
                    theme="textOnly"
                    text="버튼명"
                    size="lg"
                    icon={<Null />}
                    iconPosition={"right"}
                    disabled
                />
            </div>
        </div>
    ),
}
