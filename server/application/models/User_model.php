<?php
/**
 * Created by PhpStorm.
 * User: 王佳奇
 * Date: 2018/5/10
 * Time: 23:10
 */

class User_model extends CI_Model
{
    public $UserId;
    public $UserInfo;
    public $session_key;
    public $password;
    public $lastlogin;

    public function init()
    {
        require('Constrants.php');
    }

    public function User_insert() {
        $this->load->database();
        $succeed = $this->db->insert('User',$this);
        return $succeed;
    }

    public function User_exist()
    {
        $this->load->database();
        $query = $this->db->query('select count(*) from User where UserId = \''.$this->UserId.'\'');
        $query->result_array();
        echo $query->result_array()[0]['count(*)'];
        return (bool)$query->result_array()[0]['count(*)'];
    }

    public function User_exist_bypasswd()
    {
        $this->load->database();
        $query = $this->db->query('select count(*) from User where password = \''.$this->password.'\'');
        $query->result_array();
        echo $query->result_array()[0]['count(*)'];
        return (bool)$query->result_array()[0]['count(*)'];
    }

    public function User_islogin()
    {
        $this->load->database();
        $passwd = $this->password;
        $query = $this->db->query('select count(*) from User where password = \''.$passwd.'\'');

        $exist =  (bool)$query->result_array()[0]['count(*)'];

        if(!$exist) return false;           ///不存在用户的情况

        ///存在用户时验证上次登陆时间，间隔不超过30天

        $query2 = $this->db->query('select lastlogin from User where password = \''.$passwd.'\'');
        $lastlogin = $query2->result_array()[0]['lastlogin'];
        $valid = (time() - $lastlogin)/86400 < 30;

        if($valid)
        {
            $this->User_updatelogin();      //更新登录时间
            return true;
        }

        return false;
    }

    public function User_getid($password)
    {
        $this->load->database();
        $query = $this->db->query('select count(*) from User where password = \''.$password.'\'');

        $exist =  (bool)$query->result_array()[0]['count(*)'];

        if(!$exist) return 'error';           ///不存在用户的情况

        ///存在用户时取得其id

        $query2 = $this->db->query('select UserId from User where password = \''.$password.'\'');
        return $query2->result_array()[0]['UserId'];
    }

    public function User_getpassword($userid)
    {
        $this->load->database();
        $query = $this->db->query('select count(*) from User where UserId = \''.$userid.'\'');

        $exist =  (bool)$query->result_array()[0]['count(*)'];

        if(!$exist) return '       ///不存在用户的情况
        error';
        ///存在用户时取得其id

        $query2 = $this->db->query('select password from User where UserId = \''.$userid.'\'');
        return $query2->result_array()[0]['password'];
    }

    public function User_select()
    {
        $this->load->database();
        $query = $this->db->query('select * from User');

        return json_encode($query->result_array());
    }

    public function User_update()
    {
        $this->load->database();
        $querystring = 'update User set session_key = \''.$this->session_key.'\''.
        ' ,password = \''.$this->password.'\' '.
        ' ,lastlogin = \''.$this->lastlogin.'\''.
        'where UserId = \''.$this->UserId.'\'';
        //echo $querystring;
        $query = $this->db->query($querystring);
        //echo $query;
    }

    public function User_updatelogin()
    {
        $querystring = 'update User set lastlogin = \''.time().'\''.
            'where password = \''.$this->password.'\'';
        //echo $querystring;
        $query = $this->db->query($querystring);
    }

    public function User_updateinfo()
    {
        if($this->User_islogin() == false)
        {
            throw (new Exception(Constrants::E_LOGIN_ERROR));
        }
        $this->load->database();
        $querystring = 'update User set UserInfo = \''.$this->UserInfo.'\''.
            'where password = \''.$this->password.'\'';

        $query = $this->db->query($querystring);
    }

}