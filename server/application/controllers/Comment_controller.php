<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Comment_controller extends CI_Controller {
  public function Comment_add() {
      $this->load->database();
      $this->load->model('Comment_model');
      
      $this->load->model('User_model');
      if(!$this->User_model->islogin($_GET['UserId'])){
        var_dump(false);
        return;
      }
      $userid=$this->User_model->get_Userid($_GET['UserId']);
      $this->Comment_model->insertNewComment(
        $_GET['MusicId'],
        $userid,
        $_GET['Content']
      );
      var_dump(true);
      //$_POST[]  
    }

    public function Comment_delete() {
      $this->load->database();
      $this->load->model('Comment_model');
      $this->load->model('Likelist_model');

      if(!$this->User_model->islogin($_GET['UserId'])){
        var_dump(false);
        return;
      }
      $userid=$this->User_model->get_Userid($_GET['UserId']);
      if(!$this->Comment_model->idBelong($userid)){
        var_dump(false);
        return;
      }
      $this->Comment_model->deleteCommentByID($_GET['CommentId']);
      $this->Likelist_model->deleteLikesByCommentId($_GET['CommentId']);
      var_dump(true);
      //$this->db->insert('Comment',$com);
      //$_POST[]  
    }

    public function Commetn_select() {
      $this->load->database();
      $this->load->model('Comment_model');

      $result=$this->Comment_model->getCommentByMusic($_GET['MusicId'],$_GET['PageLimit'],$_GET['Offset']);
      $tem=json_encode($result);
      echo $tem;
      //return $tem;
      //$this->db->insert('Comment',$com);
      //$_POST[]  
    }

    public function Comment_response() {
      $this->load->database();
      $this->load->model('Comment_model');
      $this->load->model('User_model');
      
      $this->load->model('User_model');
      if(!$this->User_model->islogin($_GET['UserId'])){
        var_dump(false);
        return;
      }
      $userid=$this->User_model->get_Userid($_GET['UserId']);
      $this->Comment_model->insertNewComment($userid,$_GET['MusicId'],'回复'.$_GET['ResponseTo'].':'.$_GET['Content']);
      var_dump(true);
      //$this->db->insert('Comment',$com);
      //$_POST[]  
    }
}
