<?php
class Likelist_constraints
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
  //like not exist
  const E_LIKE_NOT_EXIST='E_LIKE_NOT_EXIST';
}