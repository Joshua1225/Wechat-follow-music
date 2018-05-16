<?php
defined('BASEPATH') OR exit('No direct script access allowed');



class Comment_select extends CI_Controller {
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

      $result=$this->Comment_model->getCommentByMusic($_GET['MusicId'],$_GET['PageLimit'],$_GET['Offset']);
      $tem=json_encode($result);
      echo $tem;
      //return $tem;
      //$this->db->insert('Comment',$com);
      //$_POST[]  
    }
}

