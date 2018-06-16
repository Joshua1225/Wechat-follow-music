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
    public $session_key;
    public $password;
    public $lastlogin;
    public $Musiclist;
    public $nickName;
    public $avatarUrl;

    public function init()
    {
        require_once('Constrants.php');
    }

    public function User_insert() {
        $this->load->database();
        $this->Musiclist=-1;
        $succeed = $this->db->insert('User',$this);
        return $succeed;
    }

    public function getMusicList()
    {
        $querystring = 'select MusicList from User where UserId =\''.$this->UserId.'\'';
        $query = $this->db->query($querystring);
        return $query->result_array()[0]['MusicList'];
    }

    public function User_updateMusicList()
    {
        $this->load->database();

        $querystring = 'select * from User where UserId =\''.$this->UserId.'\'';
        $query0 = $this->db->query($querystring);

        //echo json_encode($query->result_array()[0]);

        //if(!key_exists(0,$query0->result_array()[])) throw new Exception(Constrants::E_LOGIN_ERROR);

        if($query0->result_array()[0]['MusicList']!='-1') return;

        $this->load->model('Musiclist_model');

        $this->Musiclist_model->MusiclistName=md5($this->UserId);
        $this->Musiclist_model->MusicIdList='';
        $this->Musiclist_model->UserId=$this->UserId;

        $this->Musiclist_model->Musiclist_insert();

        $querystring = 'select * from Musiclist where MusiclistName =\''.md5($this->UserId).'\'';
        $query = $this->db->query($querystring);

        $querystring = 'update User set MusicList = \''.$query->result_array()[0]['MusiclistId'].'\''.
            'where UserId = \''.$this->UserId.'\'';
        //echo $querystring;
        $this->db->query($querystring);

        $querystring = 'update Musiclist set MusiclistName = \'我喜欢的音乐\''.
            'where MusiclistId = \''.$query->result_array()[0]['MusiclistId'].'\'';
        //echo $querystring;
        $this->db->query($querystring);
    }

    public function User_exist()
    {
        $this->load->database();
        $query = $this->db->query('select count(*) from User where UserId = \''.$this->UserId.'\'');
        $query->result_array();
        //echo $query->result_array()[0]['count(*)'];
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
        //        ///////////////
        //        //echo ('select * from User where password = \''.$passwd.'\'');
        //
        ////        echo $passwd.' ';
        ////        echo json_encode($query->result_array());
        ////
        ////        $query = $this->db->query('select * from User ');
        ////
        ////        echo $passwd.' ';
        ////        echo json_encode($query->result_array());
        //        ///////////////////////
        //        //echo 'hello1';
        if(!$exist) return false;           ///不存在用户的情况

        ///存在用户时验证上次登陆时间，间隔不超过30天

        $query2 = $this->db->query('select lastlogin from User where password = \''.$passwd.'\'');
        $lastlogin = $query2->result_array()[0]['lastlogin'];
        $valid = (time() - $lastlogin)/86400 < 30;

        if($valid)
        {
            $this->User_updatelogin();      //更新登录时间
            $this->UserId = $this->User_getid($this->password);
            $this->User_updateMusicList();
            return true;
        }

        return false;
    }

    public function User_getid($password)
    {
        $this->load->database();
        $query = $this->db->query('select count(*) from User where password = \''.$password.'\'');

        $exist =  (bool)$query->result_array()[0]['count(*)'];

        //echo Constrants::E_CANNOT_DELETE_FAVORITE;
        $this->init();
        if(!$exist) throw new Exception(Constrants::E_LOGIN_ERROR);           ///不存在用户的情况

        ///存在用户时取得其id

        $query2 = $this->db->query('select UserId from User where password = \''.$password.'\'');
        return $query2->result_array()[0]['UserId'];
    }

    public function User_getpassword($userid)
    {
        $this->load->database();
        $query = $this->db->query('select count(*) from User where UserId = \''.$userid.'\'');

        $exist =  (bool)$query->result_array()[0]['count(*)'];

        if(!$exist) return        ///不存在用户的情况
        'error';
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

        $querystring = 'update User set nickName = \''.$this->nickName.'\''.
            ' ,avatarUrl = \''.$this->avatarUrl.'\''.
            'where password = \''.$this->password.'\'';

        $query = $this->db->query($querystring);
    }

    public function User_authorization()
    {
        $this->load->database();
        $query = $this->db->query('select count(*) from User where UserId = \''.$this->UserId.'\' and avatarUrl is not null');
        $query->result_array();
        //echo $query->result_array()[0]['count(*)'];
        return (bool)$query->result_array()[0]['count(*)'];
    }
}