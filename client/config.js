/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://hy6e9qbe.qcloud.la';
var musicControllerUrl = `${host}/Music_controller`;
var userControllerUrl = `${host}/User_controller`;
var musicListControllerUrl = `${host}/Musiclist_controller`;
var database ='http://140.143.149.22';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/User_controller/login`,

        isloginUrl: `${host}/User_controller/islogin`,

        authUrl: `${host}/User_controller/User_authorization`,

        musicControllerUrl,
        music_getbyidUrl: `${musicControllerUrl}/Music_getbyid`,
        music_searchUrl: `${musicControllerUrl}/music_search`,
        
        musicListControllerUrl,        
        musiclist_containsUrl: `${musicListControllerUrl}/Musiclist_contains`,
        musiclist_getbyuseridUrl: `${musicListControllerUrl}/Musiclist_getbyuserid`,
        musiclist_insertUrl: `${musicListControllerUrl}/Musiclist_insert`,
        musiclist_removeUrl: `${musicListControllerUrl}/Musiclist_remove`,
        musiclist_getbyidUrl: `${musicListControllerUrl}/Musiclist_getbyid`,
        musiclist_musicsUrl: `${musicListControllerUrl}/Musiclist_musics`,
        musiclist_copyUrl: `${musicListControllerUrl}/Musiclist_copy`,
        musiclist_deleteUrl: `${musicListControllerUrl}/Musiclist_delete`,
        
        userControllerUrl,
        getMusicListUrl: `${userControllerUrl}/getMusicList`,
        updateinfoUrl: `${userControllerUrl}/updateinfo`,

        comment_selectbymusicUrl: `${host}/Comment_selectbymusic`,
        like_giveUrl:`${host}/Like_give`,
        like_withdrawUrl:`${host}/Like_withdraw`,
        comment_addUrl:`${host}/Comment_add`,
        comment_countUrl:`${host}/Comment_count`,
        comment_selectbyuserUrl:`${host}/Comment_selectbyuser`,
        comment_deleteUrl: `${host}/Comment_delete`,
        coverUrl: `${database}/picture`,
        musicUrl: `${database}/music`,
        lyricUrl: `${database}/musiclyric`
       
    }
};

module.exports = config;