<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Like_withdraw extends CI_Controller {
  public function index() {

      $this->load->database();
      $this->load->model('Comment_model');
      $this->load->model('Likelist_model');
      $this->load->model('User_model');

      try{
        if(!(array_key_exists('UserId',$_GET)&&array_key_exists('CommentId',$_GET)&&array_key_exists('MusicId',$_GET))){
          throw new Exception(Likelist_constraints::E_PARAM_NOT_EXIST);
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
        $this->Comment_model->isExist($_GET['CommentId']);
      }
      catch(Exception $e){
        echo $e->getMessage();
        return;
      }

      try{
        $userid=$this->User_model->User_getid($_GET['UserId']);
        if($this->Likelist_model->isInList($userid,$_GET['MusicId'],$_GET['CommentId'])==0){
          $this->Comment_model->downUpdateCommentLikesByID($_GET['CommentId']);
          $this->Likelist_model->deleteLikesByCommentIdUserId($_GET['CommentId'],$userid);
          var_dump(true);
        }
        else{
          throw new Exception(Likelist_constraints::E_LIKE_NOT_EXIST);
        }
      }
      catch(Exception $e){
        echo $e->getMessage();
        return;
      }
      
      
      //$this->db->insert('Comment',$com);
      //$_POST[]  
    }
}