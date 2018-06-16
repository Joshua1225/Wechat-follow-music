<?php
class Likelist_model extends CI_Model
{

    public function __construct()
    {
        $this->load->database();
        require 'Likelist_constraints.php';
    }

    public function getLikesByCommentID($id){
      if(!isset($id)){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
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
      if(!isset($cid)){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
        $this->db->where('CommentId',$cid);
        $this->db->delete('LikeList');
    }

    public function  deleteLikesByCommentIdUserId($cid,$uid){
      if(!(isset($cid)&&isset($uid))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
        $this->db->where('CommentId',$cid);
        $this->db->where('UserId',$uid);
        $this->db->delete('LikeList');
    }

    public function insertLikes($uid,$mid,$cid){
      if(!(isset($cid)&&isset($uid)&&isset($mid))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
        $data=array(
            'UserId'=>$uid,
            'MusicId'=>$mid,
            'CommentId'=>$cid
        );
        $this->db->insert('LikeList',$data);
    }

    public function isInList($uid,$cid){
      if(!(isset($cid)&&isset($uid))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
        $data=array(
            'UserId'=>$uid,
            'CommentId'=>$cid
        );
        $this->db->select('*');
        $this->db->from('LikeList');
        $this->db->where($data);
        $result=$this->db->get();
        if(empty($result->result())){
            return false;
        }
        else{
            return true;
        }
    }
}