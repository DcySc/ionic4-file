## 说明

这篇文章主要说明: 利用ionic4中的file插件,在手机上完成对文件的创建, 读取, 修改和删除等操作的过程

## 安装
#### 1.在项目中添加相关组件
在命令行中输入

    $ ionic cordova plugin add cordova-plugin-file
    $ npm install --save @ionic-native/file
    
#### 2.在app.module.ts文件中导入
这里按照[官网](https://beta.ionicframework.com/docs/native/file)的方式导入会发现导入不成功

首先, 这里要修改一下package.json文件, 要将file插件的版本改为
    
    "@ionic-native/file": "5.0.0-beta.15",
    
重新npm install后, 在 ./src/app/app.module.ts 中添加
    
    import {File} from '@ionic-native/file/ngx';

    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        File
    ],
    
## demo
注意!!! 由于file是个ionic插件, 所以整个测试过程需要打包到真机上测试.

#### 1.概述 

我们这个demo大致的需求是:

(1)界面上有两个input, 用于输入或显示我们操作的文件的文件名和内容

(2)界面设置四个按钮, 用于触发创建文件, 读取文件, 修改文件和删除文件等操作

#### 2.创建文件

我们这里完成在指定路径创建文件的功能

(1)我们需要创建一个file的service

    $ ionic g service file
    
(2)我们需要在service里导入file插件

file.service.ts:
    
    import {File} from '@ionic-native/file/ngx';
    
    constructor(private file: File) {
    }
    
(3)然后我们利用createFile的api完成创建文件的方法,我们在创建完文件之后还需要写入内容, 所以我们还需要利用writeExistingFile的api一个写入的方法, 我们这里只使用了少量的api, 请到[官网](https://beta.ionicframework.com/docs/native/file#instance-members)查看全部的api

这里, 值得一提的是file插件的createFile和writeExistingFile方法的第一个参数决定了我们操作的文件的路径, 我这里使用的是dataDirectory(应用程序存放数据文件的路径), 实际应用的时候需要根据需求选择合适的路径, 详细信息[参考github](https://github.com/apache/cordova-plugin-file#file-system-layouts)

file.service.ts:
    
    create(name, text) {
        /* 
            调用createFile方法创建文件
        */
        this.file.createFile(this.file.dataDirectory, name, false)
            .then(it => {
                // 创建完文件之后, 再在文件写入内容
                this.writeExistingFile(name, text);
            })
        .catch(e => console.log(e));
    }
    
    writeExistingFile(name, text) {
        this.file.writeExistingFile(this.file.dataDirectory, name, text)
            .then(it => console.log(it))
            .catch(e => console.log(e));
    }

    
(5) 现在我们开始完成界面

(a)我们先导入file.service.ts

home.page.ts
    
    import {FileService} from '../file.service';
    
    constructor(
        private fileService: FileService
    ) {
    }
    
(b)界面部分十分简单

home.page.html

    <ion-content> 
        <ion-item>
            <ion-label position="floating">请输入文件名</ion-label>
            <ion-input [(ngModel)]="name" maxlength="5"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label position="floating">请输入文件的内容</ion-label>
            <ion-input [(ngModel)]="text"></ion-input>
        </ion-item>
    
        <ion-button (click)="create()">创建</ion-button>
    </ion-content>
    
(c)完成create方法

home.page.ts

    name = '';
    
    text = '';
    
    create() {
        if (this.name === '' || this.text === '') return;
        this.fileService.create(this.name, this.text);
    }
    
到此为止我们就创建文件的功能了

#### 3.读取文件

我们创建完文件, 肯定需要读取的了

(1)我们在service里添加一个读取方法, 和创建方法一样, 通过file的api实现, 这里我们用text将读取的结果储存起来, 并在界面订阅

file.service.ts:

    text = new Subject<any>();

    readAsText(name) {
        this.file.readAsText(this.file.dataDirectory, name)
            .then(it => this.text.next(it))
            .catch(e => console.log(e));
    }
    
(2)界面上添加一个按钮

home.page.html

    <ion-button color="success" (click)="read()">读取</ion-button>
    
(3)我们再来完成read方法, 订阅读取结果

home.page.ts

    ngOnInit() {
        this.fileService.text.subscribe(it => this.text = it);
    }

    read() {
        if (this.name === '') return;
        this.fileService.readAsText(this.name);
    }
    
我们就完成读取的功能了
    
#### 4.修改功能

接下来, 就是修改功能了, 我们利用之前就写好的writeExistingFile方法就行了
    
(1)界面上添加一个按钮

home.page.html

    <ion-button color="tertiary" (click)="update()">修改</ion-button>
    
(3)我们再来完成update方法

home.page.ts

    update() {
        if (this.name === '' || this.text === '') return;
        this.fileService.writeExistingFile(this.name, this.text);
    }
    
我们就完成修改的功能了
    
#### 5.删除功能

最后就是删除功能了

(1)我们在service里添加一个删除方法, 和创建方法一样, 通过file的api实现

file.service.ts:

    removeFile(name) {
        this.file.removeFile(this.file.dataDirectory, name)
            .then(it => console.log(it))
            .catch(e => console.log(e));
    }
    
(2)界面上添加一个按钮

home.page.html

    <ion-button color="danger" (click)="delete()">删除</ion-button>
    
(3)我们再来完成delete方法

home.page.ts

    delete() {
        if (this.name === '') return;
        this.fileService.removeFile(this.name);
    }
    
我们就完成删除的功能了

至此, 我们就完成对文件的创建, 读取, 修改和删除等操作

    