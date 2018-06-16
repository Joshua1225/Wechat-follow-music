<?php
defined('BASEPATH') OR exit('No direct script access allowed');



class Comment_delete extends CI_Controller {
    public function index() {

      $this->load->database();
      $this->load->model('Comment_model');
      $this->load->model('Likelist_model');
      $this->load->model('User_model');


      try{
        if(!(array_key_exists('UserId',$_GET)&&array_key_exists('CommentId',$_GET))){
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
      
      $userid=$this->User_model->User_getid($_GET['UserId']);
      try{
        $this->Comment_model->isBelong($userid,$_GET['CommentId']);
      }
      catch(Exception $e){
        echo $e->getMessage();
        return;
      }
      try{
        $this->Comment_model->deleteCommentByID($_GET['CommentId']);
        $this->Likelist_model->deleteLikesByCommentId($_GET['CommentId']);
      }
      catch(Exception $e){
        echo $e->getMessage();
        return;
      }
      
      var_dump(true);
      //$this->db->insert('Comment',$com);
      //$_POST[]  
    }
}
