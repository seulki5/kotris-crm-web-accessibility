import Tooltip from '@components/common/Tooltip'

const meta = {
    title: 'Components/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'radio',
            options: ['sm', 'md'],
            description: 'Select 크기',
            table: {
                type: { summary: 'sm | md' },
                defaultValue: { summary: 'sm' }
            }
        },
        text: {
            control: 'text',
            description: '텍스트',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '내용을 입력하세요.' }
            }
        },
        direction: {
            control: 'radio',
            options: ['up', 'down'],
            description: 'Select 크기',
            table: {
                type: { summary: 'up | down' },
                defaultValue: { summary: 'up' }
            }
        },
        position: {
            control: 'radio',
            options: ['start', 'center', 'end'],
            description: 'Select 크기',
            table: {
                type: { summary: 'start | center | end' },
                defaultValue: { summary: 'center' }
            }
        },
    }
}

export default meta

// 기본 토글
export const Default = {
    args: {
        size: 'md',
        direction: 'up',
        position: 'center'
    }
}

// 선택된 토글
export const Sizes = {
    render: () => {
        return (
            <div className="flex flex-col items-center gap-10">
                <Tooltip size={'sm'} />
                <Tooltip size={'md'} />
            </div>
        )
    }
}

// 윗쪽 방향 화살표 & 왼쪽
export const DirectionUpAndPositionStart = {
    render: () => {
        return (
            <div className="flex flex-col items-center gap-10">
                <Tooltip size={'sm'} direction={'up'} position={'start'} />
                <Tooltip size={'md'} direction={'up'} position={'start'} />
            </div>
        )
    }
}

// 윗쪽 방향 화살표 & 가운데
export const DirectionUpAndPositionCenter = {
    render: () => {
        return (
            <div className="flex flex-col items-center gap-10">
                <Tooltip size={'sm'} direction={'up'} position={'center'} />
                <Tooltip size={'md'} direction={'up'} position={'center'} />
            </div>
        )
    }
}

// 윗쪽 방향 화살표 & 오른쪽
export const DirectionUpAndPositionEnd = {
    render: () => {
        return (
            <div className="flex flex-col items-center gap-10">
                <Tooltip size={'sm'} direction={'up'} position={'end'} />
                <Tooltip size={'md'} direction={'up'} position={'end'} />
            </div>
        )
    }
}

// 아랫쪽 방향 화살표 & 왼쪽
export const DirectionDownAndPositionStart = {
    render: () => {
        return (
            <div className="flex flex-col items-center gap-10">
                <Tooltip size={'sm'} direction={'down'} position={'start'} />
                <Tooltip size={'md'} direction={'down'} position={'start'} />
            </div>
        )
    }
}

// 아랫쪽 방향 화살표 & 가운데
export const DirectionDownAndPositionCenter = {
    render: () => {
        return (
            <div className="flex flex-col items-center gap-10">
                <Tooltip size={'sm'} direction={'down'} position={'center'} />
                <Tooltip size={'md'} direction={'down'} position={'center'} />
            </div>
        )
    }
}

// 아랫쪽 방향 화살표 & 오른쪽
export const DirectionDownAndPositionEnd = {
    render: () => {
        return (
            <div className="flex flex-col items-center gap-10">
                <Tooltip size={'sm'} direction={'down'} position={'end'} />
                <Tooltip size={'md'} direction={'down'} position={'end'} />
            </div>
        )
    }
}
