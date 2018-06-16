<?php
class Comment_model extends CI_Model{

    public function __construct(){
        $this->load->database();
        require 'Comment_constraints.php';
    }

    /** 用给定的id来获得特定的评论，传入id应保证为整数
     *
     *  评论的结构为：
     *  {
     *      'CommentId':int //评论的id返回0表示不存在
     *      //'UserId':varchar(25) //评论的作者(该项已不再返回)
     *      'nickName':varchar(1000) //昵称
     *      'avatarUrl':varchar(1000) //头像url
     *      'MusicId':int //评论的歌曲
     *      'Likes':int //评论获得的点赞数，不得小于0
     *      'Content':text //评论内容
     *  }
     *
     *  parse $id
     *  return array|mixed
     */
    public function getCommentByID($id){
      if(!(isset($id))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
        $result=array();
        $this->db->select('*');
        $this->db->from('Comment');
        $this->db->join('User','Comment.UserId=User.UserId');
        $this->db->where('CommentId',$id);
        $query=$this->db->get();
        foreach ($query->result() as $row){
            $result=[
                'CommentId'=>$row->CommentId,
                'nickName'=>$row->nickName,
                'avatarUrl'=>$row->avatarUrl,
                'MusicId'=>$row->MusicId,
                'Likes'=>$row->Likes,
                'Content'=>$row->Content,
                'IsLike'=>0
            ];
        }
        //var_dump($result);
        return $result;

    }

    /**
    *   可能需要添加每次提取上限
    */
    public function getCommentByMusic($id,$start=0){
      if(!(isset($id))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
     // $this->load->model("User_model");
        $result=[];
        $this->db->select('*');
        $this->db->from('Comment');
        $this->db->join('User','Comment.UserId=User.UserId');
        $this->db->where('MusicId',$id);
        $this->db->order_by('Likes','DESC');
        $this->db->limit(10,$start);
        $query=$this->db->get();
        $i=0;
        foreach ($query->result() as $row){
            $result[]=[
                'CommentId'=>$row->CommentId,
                'nickName'=>$row->nickName,
                'avatarUrl'=>$row->avatarUrl,
                'MusicId'=>$row->MusicId,
                'Likes'=>$row->Likes,
                'Content'=>$row->Content,
                'IsLike'=>0,
                'Position'=>$i
            ];
            $i++;
        }
        //var_dump($result);
        return $result;
    }


    /**
    *   可能需要添加每次提取上限
    */
    public function getCommentByUser($id,$start=0){
      if(!(isset($id))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
     // $this->load->model("User_model");
        $result=[];
        $this->db->select('*');
        $this->db->from('Comment');
        $this->db->join('User','Comment.UserId=User.UserId');
        $this->db->where('Comment.UserId',$id);
        $this->db->order_by('Likes','DESC');
        $this->db->limit(10,$start);
        $query=$this->db->get();
        $i=0;
        foreach ($query->result() as $row){
            $result[]=[
                'CommentId'=>$row->CommentId,
                'nickName'=>$row->nickName,
                'avatarUrl'=>$row->avatarUrl,
                'MusicId'=>$row->MusicId,
                'Likes'=>$row->Likes,
                'Content'=>$row->Content,
                'IsLike'=>0,
                'Position'=>$i
            ];
            $i++;
        }
        //var_dump($result);
        return $result;
    }

    public function deleteCommentByID($id){
      if(!(isset($id))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
        $this->db->where('CommentId',$id);
        try{
            $this->db->delete('Comment');
            return true;
        }
        catch(Exception $e){
            return false;
        }
    }

    public function updateCommentLikesByID($id){
      if(!(isset($id))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
        $com=$this->getCommentByID($id);
        $data=array(
            'Likes'=>$com['Likes']+1
        );
        $wha=array(
          'CommentId'=>$com['CommentId'],
          //'UserId'=>$com['UserId'],
          'MusicId'=>$com['MusicId']
        );
        $this->db->where($wha);
        $this->db->update('Comment',$data);
        return true;
    }

    public function downUpdateCommentLikesByID($id){
      if(!(isset($id))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
      $this->db->where('CommentId',$id);
      $com=$this->getCommentByID($id);
      $data=array(
          'Likes'=>$com['Likes']-1
      );
      $wha=array(
        'CommentId'=>$com['CommentId'],
        //'UserId'=>$com['UserId'],
        'MusicId'=>$com['MusicId']
      );
      $this->db->where($wha);
      $this->db->update('Comment',$data);
      return true;
    }

    public function insertNewComment($musicid,$userid,$content){
      if(!(isset($userid)&&isset($musicid)&&isset($content))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
    //  $this->load->model("User_model");
        $data=array(
            'UserId'=>$userid,
            'MusicId'=>$musicid,
            'Likes'=>0,
            'Content'=>$content
        );
        $this->db->insert('Comment',$data);
    }

    public function isBelong($userid,$commentid){
      if(!(isset($userid)&&isset($commentid))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
      $this->db->select('*');
      $this->db->from('Comment');
      $this->db->where('UserId',$userid);
      $this->db->where('CommentId',$commentid);
      $result=$this->db->get();
      if(empty($result->result())){
        throw new Exception('E_COMMENT_NOT_BELONG');
        return false;
      }
      else{
        return true;
      }
    }

    public function isExist($userid){
      if(!(isset($userid))){
        throw new Exception('E_PARAM_NOT_EXIST');
      }
      $result=$this->getCommentByID($userid);
      //var_dump($result);
      if(empty($result)){                           //出现了一些奇怪的问题，例如之前需要添加额外的 $reault->result()才可判断，但是现在不用了（？？？）
        throw new Exception('E_COMMENT_NOT_EXIST');
        return false;
      }
      else{
        return true;
      }
    }

    public function countByMusic($mid){
      if(!isset($mid)){
        throw new Exception(Comment_constraints::E_PARAM_EXIST);
        return;
      }
      $this->db->from('Comment');
      $this->db->where('MusicId',$mid);
      $result=$this->db->count_all_results();
      return $result;
    }

    public function countByUser($uid){
      if(!isset($uid)){
        throw new Exception(Comment_constraints::E_PARAM_EXIST);
        return;
      }
      $this->db->from('Comment');
      $this->db->where('UserId',$uid);
      $result=$this->db->count_all_results();
      return $result;
    }
    
}