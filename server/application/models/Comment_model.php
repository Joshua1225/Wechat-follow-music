<?php
class Comment_model extends CI_Model{

    public function __construct(){
        $this->load->database();
    }

    /** 用给定的id来获得特定的评论，传入id应保证为整数
     *
     *  评论的结构为：
     *  {
     *      'CommentId':int //评论的id返回0表示不存在
     *      'UserId':varchar(25) //评论的作者
     *      'MusicId':int //评论的歌曲
     *      'Likes':int //评论获得的点赞数，不得小于0
     *      'Content':text //评论内容
     *  }
     *
     *  parse $id
     *  return array|mixed
     */
    public function getCommentByID($id){
        $result=array();
        $this->db->select('*');
        $this->db->from('Comment');
        $this->db->where('CommentId',$id);
        $query=$this->db->get();
        foreach ($query->result() as $row){
            $result=[
                'CommentId'=>$row->CommentId,
                'UserId'=>$row->UserId,
                'MusicId'=>$row->MusicId,
                'Likes'=>$row->Likes,
                'Content'=>$row->Content
            ];
        }
        //var_dump($result);
        return $result;

    }

    public function getCommentByMusic($id,$quantity,$offset){
        $result=[];
        $this->db->select('*');
        $this->db->from('Comment');
        $this->db->where('MusicId',$id);
        $this->db->limit($quantity,$offset);
        $query=$this->db->get();
        foreach ($query->result() as $row){
            $result[]=[
                'CommentId'=>$row->CommentId,
                'UserId'=>$row->UserId,
                'MusicId'=>$row->MusicId,
                'Likes'=>$row->Likes,
                'Content'=>$row->Content
            ];
        }
        //var_dump($result);
        return $result;
    }

    public function getCommentByUser($id,$quantity){
        $result=[];
        $this->db->select('*');
        $this->db->from('Comment');
        $this->db->where('UserId',$id);
        $this->db->limit($quantity);
        $query=$this->db->get();
        foreach ($query->result() as $row){
            $result=[
                'CommentId'=>$row->CommentId,
                'UserId'=>$row->UserId,
                'MusicId'=>$row->MusicId,
                'Likes'=>$row->Likes,
                'Content'=>$row->Content
            ];
        }
        //var_dump($result);
        return $result;
    }

    public function deleteCommentByID($id){
        $this->db->where('CommentId',$id);
        try{
            $this->db->delete('Comment');
            return 1;
        }
        catch(Exception $e){
            return false;
        }
    }

    public function updateCommentLikesByID($id){
        $com=$this->getCommentByID($id);
        $data=array(
            'Likes'=>$com['Likes']+1
        );
        $this->db->where($com);
        $this->db->update('Comment',$data);
        return true;
    }

    public function downUpdateCommentLikesByID($id){
        $this->db->where('CommentId',$id);
        try{
            $com=$this->getCommentByID($id);
            $data=array(
                'Likes'=>$com['Likes']-1
            );
            $this->db->update('Comment',$data);
            return true;
        }
        catch(Exception $e){
            return false;
        }
    }

    public function insertNewComment($userid,$musicid,$content){
        $data=array(
            'UserId'=>$userid,
            'MusicId'=>$musicid,
            'Likes'=>0,
            'Content'=>$content
        );
        $this->db->insert('Comment',$data);
    }

    public function isBelong($userid,$commentid){
      $this->db->select('*');
      $this->db->from('Comment');
      $this->db->where('UserId',$userid);
      $this->db->where('CommentId',$commentid);
      $result=$this->db->get();
      if(empty($result->result())){
        return false;
      }
      else{
        return true;
      }
    }

    public function isExist($userid){
      $result=getCommentByID($userid);
      if(empty($result->result())){
        return false;
      }
      else{
        return true;
      }
    }

    
}