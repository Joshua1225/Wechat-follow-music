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
        try{
            $this->Music_model->init();
            if(!array_key_exists('keywords',$_GET))
            {
                throw new Exception( Constrants::E_PARAM_NOT_EXIST);
            }

            $start = 0;
            if(array_key_exists('start',$_GET)) $start = $_GET['start'];
            echo $this->Music_model->Music_search($_GET['keywords'],$start);
        }
        catch (Exception $e)
        {
            echo Constrants::E_Catch($e);
            return;
        }

    }

    public function Music_getbyid()
    {
        $this->load->model('Music_model');
        try{
            $this->Music_model->init();
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
        echo $this->Music_model->Music_getbyid($_GET['id']);
    }

    public function Music_haslyric()
    {
        $this->load->model('Music_model');
        try{
            $this->Music_model->init();
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
        var_dump($this->Music_model->Music_haslyric($_GET['id']));
    }
}