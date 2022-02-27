### vue-cli 项目加上ts 

####  vue add @vue/typescript
#### 1. 安装相关依赖
```
npm install --save typescript @vue/cli-plugin-typescript

```

#### 2. 新建tsconfig.json
```

{
  "compilerOptions": {
    "target": "esnext",//es版本
    /* Notice that ES2018 target is needed to be able to use Optional Chaining and Nullish Coalescing, as ESNext target doesn't seem to support these features for now. */
    "module": "esnext", //导出的模块化范式
    "moduleResolution": "node",//导入的模块解析
    "jsx": "preserve",
    "importHelpers": true,//兼容模块化导入
    "allowSyntheticDefaultImports": true,//允许
    "experimentalDecorators": true,
    "noImplicitAny": false, // 在表达式和声明上有隐含的 any类型时报错。
    "esModuleInterop": true, //允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。
    "allowJs": true,
    "sourceMap": true,
    "strict": true,
    "noEmit":true,
    "removeComments":true, //编译时删掉注释
    "baseUrl": ".",
    "paths": {
      "~/*": [
        "./*"
      ],
      "@/*": [
        "src/*"
      ]
    },
    "lib": [  
      "esnext", //解析esnext的API
      "esnext.asynciterable", 
      "dom" //解析浏览器拥有的API
    ],
    "types": [
      "webpack-env",
      "node"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "server"
  ]
}

```
如果报错types缺少相应的type,请下载。

#### 3. 将main.js改成main.ts

#### 4. 改造vue文件
* script加上 lang="ts"
* 如果有到vue-property-decorator，按照文档修改js代码

```
<template>
    <div>test</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BankInfo, JvnameMap } from '@/types/common';
import getBankList from '@/common/bankList';
import urlObj from '@/common/url';
import { JV_NAME } from '~/jv_config';
interface cnyBankInfo {
    name: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
}
@Component
export default class AddTs extends Vue {
    mounted() {
        console.log('test')
    }
}
</script>
<style lang="scss">
}
</style>

```
