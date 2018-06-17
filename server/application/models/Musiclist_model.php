<?php
/**
 * Created by PhpStorm.
 * User: 王佳奇
 * Date: 2018/5/10
 * Time: 23:10
 */
class Musiclist_model extends CI_Model
{
    public $MusiclistId;
    public $MusiclistName;
    public $MusicIdList;
    public $UserId;
    public $txtStyle;

    public function init()
    {
        require('Constrants.php');
    }

    public function Musiclist_select()
    {
        $this->load->database();
        $this->load->model('User_model');
        $query = $this->db->query('select * from Musiclist');

        $array = $query->result_array();
        foreach ($array as $x => $y)
        {
            $array[$x]['UserId'] = $this->User_model->User_getpassword($array[$x]['UserId']);
        }

        return json_encode($array);
    }

    public function Musiclist_getbyid($id)
    {
        $this->load->database();
        $this->load->model('User_model');

        $s = $id;

        $querystring = 'select * from Musiclist where MusiclistId = \''.$s.'\'';

        $query = $this->db->query($querystring);

        //echo $querystring;

        $array = $query->result_array();
        foreach ($array as $x => $y)
        {
            $array[$x]['UserId'] = $this->User_model->User_getpassword($array[$x]['UserId']);
        }

        return json_encode($array);

    }

    public function Musiclist_musics($id,$start)
    {
        $this->load->database();
        $s = $id;
        $querystring = 'select MusicIdList from Musiclist where MusiclistId =\''.$s.'\' limit '.$start.','.'10';

        $query = $this->db->query($querystring);

        //echo $querystring;

        //echo json_encode($query->result_array());

        if(!array_key_exists(0,$query->result_array())) throw new Exception(Constrants::E_MUSICLIST_NOT_EXIST);

        $musiclist = explode(';',$query->result_array()[0]['MusicIdList']);

        $result = array();

        foreach ($musiclist as $m)
        {
            $querystring = 'select * from Music where MusicId = \''.$m.'\'';

            $query = $this->db->query($querystring);

            if(array_key_exists(0,$query->result_array())) array_push($result,$query->result_array()[0]);
        }


        return json_encode($result);

    }

    public function Musiclist_getbyuserid($password)
    {
        $this->load->database();
        $this->load->model('User_model');

        $userid = $this->User_model->User_getid($password);

        $querystring = 'select * from Musiclist where UserId = \''.$userid.'\'';

        $query = $this->db->query($querystring);

        //echo $querystring;

        $array = $query->result_array();
        foreach ($array as $x => $y)
        {
            $array[$x]['UserId'] = $this->User_model->User_getpassword($array[$x]['UserId']);
        }

        return json_encode($array);
    }

    public function Musiclist_insert()
    {
        $this->load->database();
        //$this->load->model('User_model');
        $succeed = $this->db->insert('Musiclist',$this);
        return $succeed;
    }

    public function Musiclist_changename()
    {
        $this->load->database();
        $querystring = 'update Musiclist set MusiclistName = \''.$this->MusiclistName.'\' where MusiclistId = \''.$this->MusiclistId.'\'';
        echo $querystring;
        $query = $this->db->query($querystring);
        return $query;
    }

    public function Musiclist_add($MusiclistId,$MusicId)
    {
        $this->load->database();
        $querystring = 'select MusicIdList from Musiclist where MusiclistId = \''.$MusiclistId.'\'';
        $query = $this->db->query($querystring);

        $result = $query->result_array()[0]['MusicIdList'];

        if(!array_key_exists(0,$query->result_array())) throw new Exception(Constrants::E_MUSICLIST_NOT_EXIST);

        $musics = explode(';',$result);

        if(in_array($MusicId,$musics)) return false;

        $count = count($musics);

        if($count == 1 && $musics[0]=='')
        {
            $querystring = 'update Musiclist set MusicIdlist = \''.$MusicId.'\' where MusiclistId = \''.$MusiclistId.'\'';
            return $this->db->query($querystring);
        }

        else
        {
            $querystring = 'update Musiclist set MusicIdlist = \''.$result.';'.$MusicId.'\' where MusiclistId = \''.$MusiclistId.'\'';
            return $this->db->query($querystring);
        }

    }

    public function Musiclist_delete($MusiclistId,$MusicId)
    {
        $this->load->database();
        $querystring = 'select MusicIdList from Musiclist where MusiclistId = \''.$MusiclistId.'\'';
        $query = $this->db->query($querystring);

        $result = $query->result_array()[0]['MusicIdList'];
        $musics = explode(';',$result);

        if(!in_array($MusicId,$musics)) throw new Exception(Constrants::E_EXEC_SQL_QUERY);

        $count = count($musics);


        $add = '';
        foreach ($musics as $x)
        {
            if($x==$MusicId) continue;
            if($add=='') $add = $add.$x;
            else $add = $add.';'.$MusicId;
        }

        $querystring = 'update Musiclist set MusicIdlist = \''.$add.'\' where MusiclistId = \''.$MusiclistId.'\'';
        return $this->db->query($querystring);
    }

    public function Musiclist_remove($userid,$musiclistid)
    {
        $this->load->database();

        $querystring = 'select * from User where UserId = \''.$userid.'\'';
        $query = $this->db->query($querystring);

        if($query->result_array()[0]['MusicList'] == $musiclistid) throw new Exception(Constrants::E_CANNOT_DELETE_FAVORITE);
        /////判断歌单存在
        $querystring = 'select UserId,MusicIdList,MusiclistName from Musiclist where MusiclistId = \''.$musiclistid.'\'';
        $query = $this->db->query($querystring);

        if(count($query->result_array()) == 0) throw new Exception(Constrants::E_MUSICLIST_NOT_EXIST);
        /////////////
        $querystring = 'delete from Musiclist where MusiclistId = \''.$musiclistid.'\'';
        $query = $this->db->query($querystring);
        return $query;

    }

    public function Musiclist_copy($musiclistid,$userid)
    {
        $this->load->database();
        $querystring = 'select UserId,MusicIdList,MusiclistName from Musiclist where MusiclistId = \''.$musiclistid.'\'';
        $query = $this->db->query($querystring);

        if(count($query->result_array()) == 0) throw new Exception(Constrants::E_MUSICLIST_NOT_EXIST);

        if($userid == $query->result_array()[0]['UserId']) throw new Exception(Constrants::E_PARAM_ILLEGAL);

        $this->MusicIdList = $query->result_array()[0]['MusicIdList'];
        $this->MusiclistName = $query->result_array()[0]['MusiclistName'];
        $this->UserId = $userid;

        $succeed = $this->db->insert('Musiclist',$this);
        //print $this;
        return $succeed;
    }

    public function Musiclist_Musicscount($id)
    {
        $this->load->database();

        $querystring = 'select MusicIdList from Musiclist where MusiclistId =\''.$id.'\'';

        $query = $this->db->query($querystring);

        if(!array_key_exists(0,$query->result_array())) throw new Exception(Constrants::E_MUSICLIST_NOT_EXIST);

        $result = $query->result_array()[0]['MusicIdList'];
        $musics = explode(';',$result);

        $count = count($musics);

        if($count == 1 && $musics[0]=='') return 0;
        else return $count;

    }

    public function Musiclist_contains($musiclistid,$musicid)
    {
        $this->load->database();

        $querystring = 'select MusicIdList from Musiclist where MusiclistId =\''.$musiclistid.'\'';

        $query = $this->db->query($querystring);

        if(!array_key_exists(0,$query->result_array())) throw new Exception(Constrants::E_MUSICLIST_NOT_EXIST);

        $result = $query->result_array()[0]['MusicIdList'];
        $musics = explode(';',$result);

        if(in_array($musicid,$musics)) return true;
        else return false;
    }
}