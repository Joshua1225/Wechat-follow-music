<?php
class Likelist_model extends CI_Model
{

    public function __construct()
    {
        $this->load->database();
    }

    public function getLikesByCommentID($id){
        $result=[];
        $this->db->select('*');
        $this->db->from('LikeList');
        $this->db->where('CommentId',$id);
        $query=$this->db->get();
        foreach ($query->result() as $row){
            $result=[
                'CommentId'=>$row->CommentId,
                'MusicId'=>$row->MusicId,
                'UserId'=>$row->UserId
            ];
        }
        //var_dump($result);
        return $result;
    }

    public function deleteLikesByCommentId($cid){
        $this->db->where('CommentId',$cid);
        $this->db->delete('LikeList');
    }

    public function  deleteLikesByCommentIdUserId($cid,$uid){
        $this->db->where('CommentId',$cid);
        $this->db->where('UserId',$uid);
        $this->db->delete('LikeList');
    }

    public function insertLikes($uid,$mid,$cid){
        $data=array(
            'UserId'=>$uid,
            'MusicId'=>$mid,
            'CommentId'=>$cid
        );
        $this->db->insert('LikeList',$data);
    }

    public function isInList($uid,$mid,$cid){
        $data=array(
            'UserId'=>$uid,
            'MusicId'=>$mid,
            'CommentId'=>$cid
        );
        $this->db->select('*');
        $this->db->from('LikeList');
        $this->db->where($data);
        $result=$this->db->get();
        if(empty($result->result())){
            return 1;
        }
        else{
            return 0;
        }
    }
}