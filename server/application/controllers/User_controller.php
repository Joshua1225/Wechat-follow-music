<?php
/**
 * Created by PhpStorm.
 * User: 王佳奇
 * Date: 2018/5/13
 * Time: 13:58
 */
class User_controller extends CI_Controller
{
//    public function User_exist()
//    {
//        $this->load->model('User_model');
//        $this->User_model->UserId=$_GET['id'];
//        var_dump($this->User_model->User_exist());
//
//    }
//
//    public function User_select()
//    {
//        $this->load->model('User_model');
//        echo $this->User_model->User_select();
//    }

    ///登陆，用户创建更新用户数据
    /**
     *
     */
    public function login()
    {
        $this->load->model('User_model');
        try{

            $this->User_model->init();
            if(!array_key_exists('code',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }

            $get = $_GET['code'];

            $url='https://api.weixin.qq.com/sns/jscode2session?appid=wx420d331ec7f1c098&secret=460d8f231cf7fb75f2c2f09f6380989d&js_code='.
                $get.'&grant_type=authorization_code';
            $obj = file_get_contents($url);
            //echo $obj;
            $html = json_decode($obj);
            //echo $html;

            if(!property_exists($html,'openid'))
            {
                echo 'error';
                return;
            }

            $openid = $html->openid;
            $session_key = $html->session_key;

            $time = time();
            $password = md5($session_key.$time);

            //修改模型内容
            $this->User_model->UserId=$openid;
            $this->User_model->session_key = $session_key;
            $this->User_model->password = $password;
            $this->User_model->lastlogin = $time;
            /////
            ///
            /// 判断用户是否存在
            if($this->User_model->User_exist())
            {
                $this->User_model->User_update();
                //sleep(0.5);
                $this->User_model->User_updateMusicList();
            }
            else
            {
                $this->User_model->User_insert();
                //sleep(0.5);
                $this->User_model->User_updateMusicList();
            }
            echo  $password;
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }
    }

    ///验证登陆状态
    public function islogin()
    {
        $this->load->model('User_model');

        try{
            //$this->User_model->init();
            if(!array_key_exists('userid',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }
            //$this->User_model->UserId = $this->User_model->User_getid($_GET['userid']);
            $this ->User_model->password = $_GET['userid'];
            //$this->User_model->User_updateMusicList();
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }

        var_dump( $this ->User_model->User_islogin());
    }

    //更新用户昵称
    public function updateinfo()
    {
        $this->load->model('User_model');

        try{
            $this->User_model->init();
            if(!array_key_exists('userid',$_GET) || !array_key_exists('userinfo',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }
            $password = $_GET['userid'];
            $info = json_decode($_GET['userinfo']);

            $userinfo = array();
            $userinfo['nickName'] = $info->nickName;
            $userinfo['avatarUrl'] = $info->avatarUrl;

            $this ->User_model->password = $password;
            $this ->User_model->nickName = $info->nickName;
            $this ->User_model->avatarUrl = $info->avatarUrl;

            $this->User_model->User_updateinfo();
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
        }
    }

    public function getMusicList()
    {
        try{
            $this->load->model('User_model');
            if(!array_key_exists('userid',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }

            $this->User_model->UserId = $this->User_model->User_getid ($_GET['userid']);
            echo $this->User_model->getMusicList();
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }
    }

    public function User_authorization()
    {
        try{
            $this->load->model('User_model');
            if(!array_key_exists('userid',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }

            $this->User_model->UserId = $this->User_model->User_getid ($_GET['userid']);
            var_dump($this->User_model->User_authorization());
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }
    }

}