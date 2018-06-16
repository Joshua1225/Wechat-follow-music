<?php
defined('BASEPATH') OR exit('No direct script access allowed');



class Comment_count extends CI_Controller {
  public function index() {

    $this->load->database();
    $this->load->model('Comment_model');
    $this->load->model('User_model');
    $this->load->model('Likelist_model');

    if(array_key_exists('MusicId',$_GET)){
        try{
          $res=$this->Comment_model->countByMusic($_GET['MusicId']);
          echo $res;
          return;
        }
        catch(Exception $e){
          echo $e->getMessage();
        }
    }
    else if(array_key_exists('UserId',$_GET)){
        $this->User_model->init();
        try{
          $this->User_model->password = $_GET['UserId'];
          if(!$this->User_model->User_islogin()){
            throw new Exception(Constrants::E_LOGIN_ERROR);
            //return;
          }
        }
        catch(Exception $e){
          echo $e->getMessage();
          return;
        }
        
        $userid=$this->User_model->User_getid($_GET['UserId']);

        try{
          $res=$this->Comment_model->countByUser($userid);
          echo $res;
          return;
        }
        catch(Exception $e){
          echo $e->getMessage();
        }
    }

    try{
      throw new Exception(Comment_constraints::E_PARAM_NOT_EXIST);
    }
    catch(Exception $e){
      echo $e->getMessage();
      return;
    }

    //return $tem;
    //$this->db->insert('Comment',$com);
    //$_POST[]  
  }
}

