<?php
/**
 * Created by PhpStorm.
 * User: 王佳奇
 * Date: 2018/5/13
 * Time: 13:59
 */
class Music_controller extends CI_Controller
{
    public function Music_select()
    {
        $this->load->model('Music_model');
        echo $this->Music_model->Music_select();
    }

    public function Music_search()
    {
        $this->load->model('Music_model');
        echo $this->Music_model->Music_search($_GET['keywords']);
    }

    public function Music_getbyid()
    {
        $this->load->model('Music_model');
        echo $this->Music_model->Music_getbyid($_GET['id']);
    }

    public function Music_haslyric()
    {
        $this->load->model('Music_model');
        var_dump($this->Music_model->Music_haslyric($_GET['id']));
    }

}