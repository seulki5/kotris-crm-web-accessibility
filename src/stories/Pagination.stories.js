import { Pagination } from '@components/common/Pagination'

const meta = {
    title: 'Components/Pagination',
    component: Pagination,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '페이지네이션을 위한 컴포넌트입니다. 페이지 이동, 처음/마지막 페이지 이동을 지원합니다.'
            }
        }
    },
    argTypes: {
        pagingData: {
            description: '페이지네이션 데이터',
            control: 'object'
        },
        onPaging: {
            description: '페이지 변경 핸들러',
            control: 'function'
        }
    },
    tags: ['autodocs'],
}

export default meta

export const Default = {
    args: {
        pagingData: {
            dataTotal: 50,
            blockData: 10,
            blockGroup: 5,
            activePage: 1,
            activeLastBtn: true,
        },
        onPaging: (page) => alert('Page clicked:', page),
    },
}

export const WithoutEndButtons = {
    args: {
        pagingData: {
            dataTotal: 50,
            blockData: 10,
            blockGroup: 5,
            activePage: 1,
            activeLastBtn: false,
        },
        onPaging: (page) => alert('Page clicked:', page),
    },
}

export const ActivePage = {
    args: {
        pagingData: {
            dataTotal: 50,
            blockData: 10,
            blockGroup: 5,
            activePage: 3,
            activeLastBtn: true,
        },
        onPaging: (page) => alert('Page clicked:', page),
    },
}
