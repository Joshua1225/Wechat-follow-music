<?php
defined('BASEPATH') OR exit('No direct script access allowed');



class Like_isliked extends CI_Controller {
  public function index() {

      function shutdownfunc()
      {
        if ($error = error_get_last()) {
          var_dump('<b>register_shutdown_function: Type:' . $error['type'] . ' Msg: ' . $error['message'] . ' in ' . $error['file'] . ' on line ' . $error['line'] . '</b>');
          die();
        }
      }

      function errorfun($type, $message, $file, $line)
      {
        var_dump('<b>set_error_handler: ' . $type . ':' . $message . ' in ' . $file . ' on ' . $line . ' line .</b><br />');
        die();
      }

      set_error_handler('errorfun');
      register_shutdown_function('shutdownfunc');

      $this->load->database();
      $this->load->model('Comment_model');
      $this->load->model('Likelist_model');
      $this->load->model('User_model');

      if(!$this->User_model->islogin($_GET['UserId'])){
        var_dump(false);
      }
      $userid=$this->User_model->get_Userid($_GET['UserId']);
      if($this->Likelist_model->isInList($userid,$_GET['MusicId'],$_GET['CommentId'])){
        var_dump(true);
      }
      else{
        var_dump(false);
      }
     
      //$this->db->insert('Comment',$com);
      //$_POST[]  
    }
}