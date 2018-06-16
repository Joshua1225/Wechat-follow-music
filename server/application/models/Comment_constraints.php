<?php
class Comment_constraints
{
  static function E_catch($e){
    return $e->getMessage();
  }
  //sql connect failed
  const E_CONNECT_TO_DB='E_CONNECT_TO_DB';
  //sql operation failed
  const E_EXEC_SQL_QUERY='E_EXEC_SQL_QUERY';
  //param not exist
  const E_PARAM_NOT_EXIST='E_PARAM_NOT_EXIST';
  //user invalid
  const E_LOGIN_ERROR='E_LOGIN_ERROR';
  //comment not exist
  const E_COMMENT_NOT_EXIST='E_COMMENT_NOT_EXIST';
  //comment not belong
  const E_COMMENT_NOT_BELONG='E_COMMENT_NOT_BELONG';
  //didn't authorized
  const E_NOT_AUTHORIZED='E_NOT_AUTHORIZED';
}