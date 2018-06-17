/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://hy6e9qbe.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/User_controller/login`,

        isloginUrl: `${host}/User_controller/islogin`,

        authUrl: `${host}/User_controller/User_authorization`,

        musicUrl: `${host}/Music_controller/`,
        
        userUrl: `${host}/User_controller/`,

        coverUrl:``

    }
};

module.exports = config;