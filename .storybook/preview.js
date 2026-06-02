import "../src/styles/globals.css"

const preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            disable: true,
            default: 'light',
        },
        layout: 'fullscreen',
        options: {
            storySort: {
                order: ['Design System', ['Colors', 'Icons']],
            },
        },
    },
};

export default preview;
