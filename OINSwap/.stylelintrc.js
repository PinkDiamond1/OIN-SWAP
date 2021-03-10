module.export = {
  "processors":[
    "stylelint-processor-styled-components"
  ],
  extends:[
    "stylelint-config-recommended",
    "stylelint-config-styled-components",
    "stylelint-order",
    "stylelint-config-prettier"
  ],
  "ignoreFiles": ["**/*.js"]
}
