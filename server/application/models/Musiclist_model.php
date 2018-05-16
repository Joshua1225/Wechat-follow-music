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
    public $MusicCount;

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
        foreach ($array as $x)
        {
            $x->UserId = $this->User_model->getpassword($x->UserId);
        }

        return json_encode($array);

    }

    public function Musiclist_musics($id)
    {
        $this->load->database();
        $s = $id;
        $querystring = 'select MusicIdList from Musiclist where MusiclistId = \''.$s.'\'';

        $query = $this->db->query($querystring);

        //echo json_encode($query->result_array());

        $musiclist = explode(';',$query->result_array()[0]['MusicIdList']);

        return json_encode($musiclist);

    }

    public function Musiclist_getbyuserid($password)
    {
        $this->load->database();
        $this->load->model('User_model');

        if(!$this->User_model->User_islogin()) return 'error';

        $userid = $this->User_model->User_getid($password);

        $querystring = 'select * from Musiclist where UserId = \''.$userid.'\'';

        $query = $this->db->query($querystring);

        //echo $querystring;

        return json_encode($query->result_array());
    }

    public function Musiclist_insert()
    {
        $this->load->database();
        $this->load->model('User_model');

        if(!$this->User_model->User_islogin()) return 'error';

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

        if(!in_array($MusicId,$musics)) return false;

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

}