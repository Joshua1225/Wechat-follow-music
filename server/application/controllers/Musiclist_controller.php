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
        echo $this->Musiclist_model->Musiclist_getbyid($_GET['id']);

    }

    public function Musiclist_musics()
    {
        $this->load->model('Musiclist_model');
        echo $this->Musiclist_model->Musiclist_musics($_GET['id']);

    }

    public function Musiclist_getbyuserid()
    {
        $this->load->model('Musiclist_model');
        echo $this->Musiclist_model->Musiclist_getbyuserid($_GET['userid']);
    }

    public function Musiclist_insert()
    {
        $this->load->model('Musiclist_model');
        $this->load->model('User');
        $this->Musiclist_model->MusiclistName=$_GET['name'];
        $this->Musiclist_model->UserId=$this->User->User_getid($_GET['userid']);
        var_dump($this->Musiclist_model->Musiclist_insert());
    }

    public function Musiclist_changename()
    {
        $this->load->model('Musiclist_model');
        $this->Musiclist_model->MusiclistName=$_GET['newname'];
        $this->Musiclist_model->MusiclistId=$_GET['id'];
        var_dump($this->Musiclist_model->Musiclist_changename());
    }

    public function Musiclist_add()
    {
        $this->load->model('Musiclist_model');
        var_dump($this->Musiclist_model->Musiclist_add($_GET['musiclistid'],$_GET['musicid']));
    }

    public function Musiclist_delete()
    {
        $this->load->model('Musiclist_model');
        var_dump($this->Musiclist_model->Musiclist_delete($_GET['musiclistid'],$_GET['musicid']));
    }

}