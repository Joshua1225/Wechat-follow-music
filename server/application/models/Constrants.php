<?php
/**
 * Created by PhpStorm.
 * User: 王佳奇
 * Date: 2018/5/19
 * Time: 18:45
 */
class Constrants
{

    static function E_Catch($e)
    {
        return $e->getMessage();
    }

    /* MySQL */
    // 连接数据库错误
    const E_CONNECT_TO_DB = 'E_CONNECT_TO_DB';
    // 插入数据错误
    const E_EXEC_SQL_QUERY = 'E_EXEC_SQL_QUERY';

    /*函数错误*/
    //参数不存在
    const E_PARAM_NOT_EXIST = 'E_PARAM_NOT_EXIST';

    /*登陆异常*/
    //用户id不存在或失效
    const E_LOGIN_ERROR ='E_LOGIN_ERROR';

}