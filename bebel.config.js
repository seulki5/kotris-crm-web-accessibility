module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    '@': './src',
                    '@components': './src/components',
                    '@assets': './src/assets',
                    '@modules': './src/modules',
                },
            },
        ],
    ],
};