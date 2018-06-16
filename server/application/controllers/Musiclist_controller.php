<?php
/**
 * Created by PhpStorm.
 * User: 王佳奇
 * Date: 2018/5/13
 * Time: 14:00
 */
class Musiclist_controller extends CI_Controller
{
    public function Musiclist_select()
    {
        $this->load->model('Musiclist_model');
        echo $this->Musiclist_model->Musiclist_select();
    }

    public function Musiclist_getbyid()
    {
        $this->load->model('Musiclist_model');
        try{
            $this->Musiclist_model->init();
            if(!array_key_exists('id',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }
        echo $this->Musiclist_model->Musiclist_getbyid($_GET['id']);

    }

    public function Musiclist_musics()
    {
        $this->load->model('Musiclist_model');
        try{
            $this->Musiclist_model->init();
            if(!array_key_exists('id',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }
            $start = 0;
            if(array_key_exists('start',$_GET)) $start = $_GET['start'];
            echo $this->Musiclist_model->Musiclist_musics($_GET['id'],$start);
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }


    }

    public function Musiclist_getbyuserid()
    {
        $this->load->model('Musiclist_model');
        $this->load->model('User_model');

        try{
            $this->Musiclist_model->init();
            if(!array_key_exists('userid',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }

            $this->User_model->password = $_GET['userid'];
            if(!$this->User_model->User_islogin()) throw new Exception(Constrants::E_LOGIN_ERROR);

            echo $this->Musiclist_model->Musiclist_getbyuserid($_GET['userid']);
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }

    }

    public function Musiclist_insert()
    {
        $this->load->model('Musiclist_model');
        $this->load->model('User_model');
        try{
            $this->Musiclist_model->init();
            if(!array_key_exists('name',$_GET) || !array_key_exists('userid',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }
            $this->User_model->password=$_GET['userid'];
            if(!$this->User_model->User_islogin()) throw new Exception(Constrants::E_LOGIN_ERROR);
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }
        $this->Musiclist_model->MusiclistName=$_GET['name'];
        $this->Musiclist_model->UserId=$this->User_model->User_getid($_GET['userid']);
        try{
            var_dump($this->Musiclist_model->Musiclist_insert());
        }
        catch (Exception $exception)
        {
            echo Constrants::E_Catch($exception);
        }
    }

    public function Musiclist_changename()
    {
        $this->load->model('Musiclist_model');

        try{
            $this->Musiclist_model->init();
            if(!array_key_exists('newname',$_GET) || !array_key_exists('id',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }

        $this->Musiclist_model->MusiclistName=$_GET['newname'];
        $this->Musiclist_model->MusiclistId=$_GET['id'];
        var_dump($this->Musiclist_model->Musiclist_changename());
    }

    public function Musiclist_add()
    {
        $this->load->model('Musiclist_model');
        try{
            $this->Musiclist_model->init();
            if(!array_key_exists('musiclistid',$_GET) || !array_key_exists('musicid',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }
        var_dump($this->Musiclist_model->Musiclist_add($_GET['musiclistid'],$_GET['musicid']));
    }

    public function Musiclist_delete()
    {
        $this->load->model('Musiclist_model');
        try{
            $this->Musiclist_model->init();
            if(!array_key_exists('musiclistid',$_GET) || !array_key_exists('musicid',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }
            var_dump($this->Musiclist_model->Musiclist_delete($_GET['musiclistid'],$_GET['musicid']));
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }

    }

    public function Musiclist_remove()
    {
        $this->load->model('Musiclist_model');
        $this->load->model('User_model');
        try{
            $this->Musiclist_model->init();
            if(!array_key_exists('userid',$_GET)||!array_key_exists('musiclistid',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }
            $this->User_model->password=$_GET['userid'];
            if(!$this->User_model->User_islogin()) throw new Exception(Constrants::E_LOGIN_ERROR);
            $userid=$this->User_model->User_getid($_GET['userid']);
            $musiclistid = $_GET['musiclistid'];
            var_dump($this->Musiclist_model->Musiclist_remove($userid,$musiclistid));
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }

    }

    public  function Musiclist_copy()
    {
        $this->load->model('Musiclist_model');
        $this->load->model('User_model');
        try{
            $this->Musiclist_model->init();
            if(!array_key_exists('musiclistid',$_GET) || !array_key_exists('userid',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }

            $this->User_model->password = $_GET['userid'];
            if(!$this->User_model->User_islogin()) throw new Exception(Constrants::E_LOGIN_ERROR);

            var_dump($this->Musiclist_model->Musiclist_copy($_GET['musiclistid'],$this->User_model->User_getid($_GET['userid'])));
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }
    }

    public function Musiclist_musicscount()
    {
        $this->load->model('Musiclist_model');
        try{
            $this->Musiclist_model->init();
            if(!array_key_exists('id',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }

            echo $this->Musiclist_model->Musiclist_musicscount($_GET['id']);
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }

    }

    public function Musiclist_contains()
    {
        $this->load->model('Musiclist_model');

        try{
            $this->Musiclist_model->init();
            if(!array_key_exists('musicid',$_GET) || !array_key_exists('musiclistid',$_GET))
            {
                throw new Exception( 'E_PARAM_NOT_EXIST');
            }

            var_dump($this->Musiclist_model->Musiclist_contains($_GET['musiclistid'],$_GET['musicid']));
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }
    }

}