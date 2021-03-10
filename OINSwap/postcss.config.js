module.exports = {
	plugins: {
		autoprefixer: {},
		'postcss-aspect-ratio-mini': {},
		'postcss-write-svg': { utf8: false },
		// 'postcss-px-to-viewport': {
		// 	unitToConvert: 'px',
		// 	viewportWidth: 750,
		// 	viewportHeight: 1334,
		// 	viewportUnit: 'vw',
		// 	unitPrecision: 3,
		// 	fontViewportUnit: 'vw',
		// 	minPixelValue: 1,
		// 	mediaQuery: false,
		// 	replace: true,
		// 	exclude: [],
		// 	landscape: false,
		// 	landscapeUnit: 'vw',
		// 	landscapeWidth: 568,
		// },
		// 碰到img无法显示，请添加全局 css
		'postcss-viewport-units': {},
		// TODO 未指明 预设的情况，cssnano 将从当前目录逐级查找 package.json 或 cssnano.config.js 文件中的某个配置段，直到主目录为止
		cssnano: {
			// cssnano-preset-*
			preset:
				'advanced' /*['advanced',{
        // 删除注释
        discardComments:{
          removeAll:true
        }
      }]*/,
		},
	},
};
