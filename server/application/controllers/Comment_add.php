<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Comment_add extends CI_Controller {
  
  public function index() {
    $this->load->database();
    $this->load->model('Comment_model');
    $this->load->model('User_model');

    try{
        if(!(array_key_exists('UserId',$_GET)&&array_key_exists('MusicId',$_GET)&&array_key_exists('Content',$_GET))){
          throw new Exception(Comment_constraints::E_PARAM_NOT_EXIST);
        }
      }
      catch(Exception $e){
        echo $e->getMessage();
        return;
      }

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

    try{
      $userid=$this->User_model->User_getid($_GET['UserId']);
      $this->User_model->UserId = $userid;
      if(!$this->User_model->User_authorization()){
        throw new Exception(Comment_constraints::E_NOT_AUTHORIZED);
      } 
      $this->Comment_model->insertNewComment(
      $_GET['MusicId'],
      $userid,
      $_GET['Content']
      );
    }
    catch(Exception $e){
      echo $e->getMessage();
      return;
    }
    
    var_dump(true);
    //$_POST[]  
  }

  
  

}
