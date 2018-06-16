<?php

class Comment_selectbyuser extends CI_Controller{
  public function index() {
      $this->load->database();
      $this->load->model('Comment_model');
      $this->load->model('User_model');
      $this->load->model('Likelist_model');

      try{
        if(!(array_key_exists('UserId',$_GET))){
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

      $result=array();
      try {
        if(array_key_exists('Start',$_GET)){
          $result = $this->Comment_model->getCommentByUser($userid,$_GET['Start']);
        }
        else{
          $result = $this->Comment_model->getCommentByUser($userid);
        }
      }
      catch(Exception $e){
          echo $e->getMessage();
          return;
      }

      foreach ($result as $key=>$link){
          //$tp=$link['UserId'];
          //$result[$key]['UserId']=$this->User_model->User_getpassword($tp);
          $result[$key]['IsLike']=$this->Likelist_model->isInList($userid,$link['CommentId']);
      }

      $tem=json_encode($result);
      echo $tem;
      //return $tem;
      //$this->db->insert('Comment',$com);
      //$_POST[]  
    }
}