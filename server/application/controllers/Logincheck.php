<?php
/**
 * Created by PhpStorm.
 * User: 王佳奇
 * Date: 2018/5/11
 * Time: 23:08
 */

class Logincheck extends CI_Controller
{
    ///登陆，用户创建更新用户数据
//    public function login()
//    {
//        $url='https://api.weixin.qq.com/sns/jscode2session?appid=wx420d331ec7f1c098&secret=460d8f231cf7fb75f2c2f09f6380989d&js_code='.
//            $_GET['code'].'&grant_type=authorization_code';
//        $obj = file_get_contents($url);
//        //echo $obj;
//        $html = json_decode($obj);
//        //echo $html;
//
//        if(!property_exists($html,'openid'))
//        {
//            echo 'error';
//            return;
//        }
//
//        $openid = $html->openid;
//        $session_key = $html->session_key;
//        $this->load->model('User_model');
//        $time = time();
//        $password = md5($session_key.$time);
//
//        //修改模型内容
//        $this->User_model->UserId=$openid;
//        $this->User_model->session_key = $session_key;
//        $this ->User_model->password = $password;
//        $this->User_model->lastlogin = $time;
//        /////
//        ///
//        /// 判断用户是否存在
//        if($this->User_model->User_exist())
//        {
//            $this->User_model->User_update();
//        }
//        else
//        {
//            $this->User_model->User_insert();
//        }
//        echo  $password;
//    }
//
//    ///验证登陆状态
//    public function User_islogin()
//    {
//        $this->load->model('User_model');
//        $this ->User_model->password = $_GET['userid'];
//        var_dump( $this ->User_model->User_islogin());
//    }
}