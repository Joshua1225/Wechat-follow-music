<?php
/**
 * Created by PhpStorm.
 * User: 王佳奇
 * Date: 2018/5/10
 * Time: 23:10
 */
class Music_model extends CI_Model
{
    public $MusicId;
    public $MusicName;
    public $MusicSinger;
    public $MusicLyric;

    public function Music_select()
    {
        $this->load->database();
        $query = $this->db->query('select * from Music');

        return json_encode($query->result_array());
    }

    public function Music_search($keywords)
    {
        $this->load->database();

        $s = (string)$keywords;

        $search = '%'.$s.'%';

        $querystring = 'select * from Music where MusicName like \''.$search . '\' or MusicSinger like \''.$search.'\'';

        $query = $this->db->query($querystring);

        //echo $querystring;

        return json_encode($query->result_array());
    }

    public function Music_getbyid($id)
    {
        $this->load->database();

        $s = $id;

        $querystring = 'select * from Music where MusicId = \''.$s.'\'';

        $query = $this->db->query($querystring);

        //echo $querystring;
        return json_encode($query->result());
    }

    public function Music_haslyric($id)
    {
        $this->load->database();
        $querystring = 'select MusicLyric from Music where MusicId = \''.$id.'\'';
        $query = $this->db->query($querystring);
        return (bool)$query->result_array()[0]['MusicLyric'];
    }

}