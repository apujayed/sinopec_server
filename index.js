const express = require("express");
const cron = require('node-cron');
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const fs = require("fs");
const { log } = require("console");
app.use(cors({origin:'*'}));
app.use(express.json());
//
const db = mysql.createConnection({
  user: "tecadmin",
  host: "localhost",
  password: "@123456789@",
  database: "tecadmin",
});


// ...

// Schedule tasks to be run on the server.
// cron.schedule('* * * * *', function() {
//   console.log('running a task every minute');
//   db.query("SELECT * FROM `users`INNER JOIN package on users.package=package.id WHERE users.active=0", (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
      
//       result.forEach(element => {
  
//         db.query(
//           "INSERT INTO `dailyreward`( `user_id`, `amount`) VALUES (?,?)",
//           [element.id,element.income],
//           (err, result) => {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log('done');
//             }
//           }
//         );
//       });
    
//     }
//   });
// });

// SELECT amount, timestamp FROM recharge
// UNION ALL
// SELECT amount ,timestamp FROM withdraw
// WHERE user_id =1
// ORDER by timestamp



app.post("/withdrawreq", (req, res) => {
  const data=req.body.data;

  db.query("SELECT * FROM users WHERE  password=?", 
  [data.pass],
  (err, result) => {
    if (err) {
     console.log(err);
   
    } else {
      // res.send(result);
      // console.log(result);
     
        db.query(
          "INSERT INTO withdraw(`user_id`, `amount`, `particular`, `status`) VALUES (?,?,?,?)",
          [data.user_id,data.amount,'Withdraw','Pending'],
          (err, result) => {
            if (err) {
             console.log(err)
            } else {
              res.send("done");
            }
          }
        );
      
     


    }
  });
});


app.post("/withdrawrec", (req, res) => {
  const u_id=req.body.data;

  db.query("SELECT * FROM `withdraw` WHERE user_id=? order by id desc", 
  [u_id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    
    }
  });
});

app.post("/login", (req, res) => {
  const u_id=req.body.data;

  db.query("SELECT users.*,package.name as pname FROM `users` INNER JOIN package ON users.package=package.id WHERE users.phone =? and users.password=?", 
  [u_id.user,u_id.pass],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      console.log(result);
    }
  });
});

app.post("/userbalance", (req, res) => {
  const u_id=req.body.data;

  db.query("SELECT sum(recharge.amount)as recharge, sum(dailyreward.amount) as reward,sum(withdraw.amount) as withdraw FROM `dailyreward` INNER join withdraw ON dailyreward.user_id=withdraw.user_id INNER join recharge ON dailyreward.user_id=recharge.user_id WHERE dailyreward.user_id=?", 
  [u_id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      console.log(result);
    }
  });
});

app.get("/packages", (req, res) => {
  console.log("kdnfn");
  db.query("SELECT * FROM `package` WHERE active=0", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    
    }
  });
});

app.post("/recharge", (req, res) => {
  const u_id=req.body.data;

  db.query("SELECT * FROM `recharge` WHERE user_id=?", 
  [u_id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    
    }
  });
});





app.get("/comd", (req, res) => {
  console.log("kdnfn");
  db.query("SELECT * FROM   company where 1", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    
    }
  });
});

app.post("/uppackages", (req, res) => {
  // const id = req.body.id;
  const data = req.body.data;

  db.query(
    "UPDATE users SET package=? WHERE id=1",
    [data],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});




app.post("/create", (req, res) => {
  const adata = req.body.adata;
// console.log(adata);

  db.query(
    "INSERT INTO `accounts`(`cus_id`,`name`,`shead`,`proprietor`,`subaddress`,`address`,`contact`,`posted`) VALUES (?,?,?,?,?,?,?,?)",
    [adata.cus_id,adata.name,adata.subhead,adata.proprietor,adata.subaddress,adata.address,adata.contact,'ADMIN'],
    (err, result) => {
      if (err) {
       console.log(err)
      } else {
        res.send("done");
      }
    }
  );
});






app.post("/createlcac", (req, res) => {
  const adata = req.body.adata;
  const code_n = adata.code_n;
  const exp_name = adata.exp_name;

  const tym= new Date().getTime().toString();
// const uid = 'LP-'+tym;

const uid = 'LC'+tym.slice(5,10);

  db.query(
    "INSERT INTO `lc_account`(`lc_no`, `lc_name`, `qty`, `country`, `imp_id`, `exp_id`, `rate`, `l_date`) VALUES (?,?,?,?,?,?,?,?)",
    [adata.lc_no,code_n+'-'+exp_name,adata.qty,adata.country,adata.imp,adata.exp,adata.rate,adata.l_date],
    (err, result) => {
      if (err) {
       console.log(err)
      } else {
        const insert_id= result.insertId;
        db.query(
          "INSERT INTO `accounts`(`cus_id`,`name`,`shead`,`lc_id`) VALUES (?,?,?,?)",
          [uid,code_n+'-'+exp_name,'LCEXPENSE',insert_id],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send("done");
  // console.log('due stock');
            }
          }
        );
        
     
      }
    }
  );
});






app.post("/createtransaction", (req, res) => {
  const adata = req.body.adata;
console.log(adata);
const tym= new Date().getTime().toString();
const comm=adata.comments;
const comments=comm===''?'CASH':adata.comments;
const uid = 'TR'+tym.slice(5,10);
  db.query(
    "INSERT INTO `b_transaction`( `date`,`inv_id`,`client_id`, `payment`, `receive`, `comments`,`posted`,`others_c`) VALUES (?,?,?,?,?,?,?,?)",
    [adata.date,uid,adata.name,adata.payment,adata.receive,comments,adata.posted,'ITRAN'],
    (err, result) => {
      if (err) {
       console.log(err)
      } else {
        res.send("done");
      }
    }
  );
});


app.post("/cartstore", (req, res) => {
  const adata = req.body.adata;
// console.log(adata);
adata.forEach(element => {
  s_ty = element.sell_type;
  const pay = s_ty=="SELL"?element.total:0; 
  const rec = s_ty=="PUR"?element.total:0; 
  db.query(
    "INSERT INTO `transaction`(`cus_id`, `date`, `c_id`, `p_id`, `qty_1`,`qty_2`, `rate`, `payment`, `receive`, `g_total`, `s_type`, `comments`, `t_belong`, `posted`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ['INV-2021','2022-01-01', element.account, element.p_id, element.qty1,element.qty2,element.rate,pay,rec,element.total,element.sell_type,element.particular,element.sell_type,'Apu'],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
      }
    }
  );
});
res.send("Values Inserted");
});



app.get("/customerdue", (req, res) => {
  
  db.query("SELECT id from accounts where status = 0", (err, result) => {
    if (err) {
      console.log(err);
    } else {
     result.forEach(e =>{
      //  console.log(`id is`+e.id);
       db.query(
        "SELECT SUM(payment)/SUM(receive) as due FROM `transaction` WHERE c_id = ? and status = 0",
        [e.id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
           const due=(result[0].due);
            db.query(
              "UPDATE accounts set due = ? WHERE id= ?",
              [due,e.id],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
               
      // console.log('due stock');
                }
              }
            );


          }
        }
      );
     })
      res.send(result);
    }
  });
});



app.get("/productstock", (req, res) => {
  db.query("SELECT id from product where status = 0", (err, result) => {
    if (err) {
      console.log(err);
    } else {
     result.forEach(e =>{
      //  console.log(`id is`+e.id);
       db.query(
        "SELECT COALESCE(sum(CASE WHEN transaction.s_type='PUR' THEN transaction.qty_2 END),0) - COALESCE(sum(CASE WHEN transaction.s_type='SELL' THEN transaction.qty_2 END),0) as stock FROM `transaction` WHERE p_id = ?",
        [e.id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
           const stock=(result[0].stock);
            db.query(
              "UPDATE product set stock = ? WHERE id= ?",
              [stock,e.id],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
               
      // console.log('done stock');
                }
              }
            );


          }
        }
      );
     })
      res.send(result);
    }
  });
});

app.put("/updatesell", (req, res) => {
  const adata = req.body.adata;
console.log(adata);
adata.forEach(element => {
 s_ty = element.id;
  // console.log(`id`+s_ty);
  const pay = s_ty=="SELL"?element.total:0; 
  const rec = s_ty=="PUR"?element.total:0; 
  db.query(
    "UPDATE `transaction` SET  `p_id`= ?,`qty_1`= ?,`qty_2`= ?,`rate`= ?,`payment`= ?,`receive`= ?,`g_total`= ?,`comments`= ?,`memo`= ? WHERE id= ?",
    [element.p_id, element.qty1,element.qty2,element.rate,pay,rec,element.total,'particular','memo',element.id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
      }
    }
  );
});
res.send("Values Inserted");
});


app.get("/shead", (req, res) => {
  console.log("kdnfn");
  db.query("SELECT * FROM subhead where status = 0", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    
    }
  });
});






app.get("/selldata", (req, res) => {
  
  db.query("SELECT (transaction.cus_id),date,count(transaction.p_id) as product,sum(transaction.g_total) as total,accounts.name, transaction.posted,transaction.s_type,transaction.b_type FROM transaction INNER JOIN accounts ON transaction.c_id = accounts.id where transaction.status=0 and transaction.date='2022-01-01' GROUP BY transaction.cus_id ORDER BY transaction.id DESC", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});




// app.get("/accounts", (req, res) => {
  
//   db.query("SELECT * FROM accounts order by id desc", (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

app.get("/product", (req, res) => {
  
  db.query("SELECT * FROM product order by id desc", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      console.log(result)
    }
  });
});

app.put("/sproduct", (req, res) => {
  const id = req.body.id;
  console.log(id);
  db.query("select * from product WHERE id = ?",
  [id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.get("/transaction", (req, res) => {
  
  db.query("SELECT accounts.shead,accounts.name,b_transaction.date,b_transaction.others_c,b_transaction.inv_id,b_transaction.id,b_transaction.payment,b_transaction.receive,b_transaction.comments FROM b_transaction INNER JOIN accounts on b_transaction.client_id=accounts.id WHERE  b_transaction.trash=0 ORDER by b_transaction.id DESC", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.get("/accounts", (req, res) => {
  
  db.query("SELECT * FROM accounts WHERE 1 order by id desc", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/selectsell", (req, res) => {
  const id = req.body.id;
  console.log(id);
  db.query("SELECT (transaction.id),transaction.s_type,transaction.b_type,accounts.name,accounts.cus_id,transaction.comments,transaction.p_id,product.p_name as product,transaction.qty_1 as qty1,transaction.qty_2 as qty2,transaction.rate,transaction.g_total as total,transaction.memo,product.qty_1,product.qty_2,product.qty_3 FROM `transaction` INNER JOIN accounts on transaction.c_id=accounts.id INNER JOIN product on transaction.p_id=product.id WHERE transaction.cus_id = ?",
  [id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/selectacccount", (req, res) => {
  const id = req.body.id;
  console.log(id);
  db.query("select * from accounts WHERE id = ?",
  [id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.put("/selecttransaction", (req, res) => {
  const id = req.body.id;
  console.log(id);
  db.query("SELECT accounts.shead,accounts.name,accounts.cus_id,b_transaction.id,b_transaction.payment,b_transaction.receive,b_transaction.comments FROM b_transaction INNER JOIN accounts on b_transaction.client_id=accounts.id WHERE b_transaction.id = ?",
  [id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.put("/updatetransaction", (req, res) => {
  // const id = req.body.id;
  const transaction = req.body.adata;
  console.log(transaction);
  db.query(
    "UPDATE b_transaction SET payment= ? ,receive= ? ,comments= ?   WHERE id= ?",
    [transaction.payment,transaction.receive,transaction.comments,transaction.id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});


app.put("/deletetransaction", (req, res) => {
  const id = req.body.id;

  console.log(id);
  db.query(
    "UPDATE b_transaction SET trash= 1  WHERE id= ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.put("/update", (req, res) => {
  // const id = req.body.id;
  const accounts = req.body.adata;
  console.log(accounts);
  db.query(
    "UPDATE accounts SET cus_id= ? ,name= ? ,proprietor= ? ,subaddress= ? ,address= ? ,contact= ?  WHERE id= ?",
    [accounts.cus_id,accounts.name,accounts.proprietor,accounts.subaddress,accounts.address,accounts.contact,accounts.id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});




app.put("/deleteaccount", (req, res) => {
  // const id = req.body.id;
  const id = req.body.id;
  console.log(id);
  db.query(
    "UPDATE accounts SET status = 1 WHERE id= ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});


app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


//////////////////////
////////////////////
//acoounts_lc

app.get("/lc", (req, res) => {
  console.log("kdnfn");
  db.query("SELECT * FROM lc_account where trash = 0", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    
    }
  });
});

app.get("/goods", (req, res) => {
  console.log("goods");
  db.query("SELECT * FROM goods where status = 0", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      console.log(result);
    }
  });
});

app.post("/lcpurchase", (req, res) => {
  const adata = req.body.adata;
  const tym= new Date().getTime().toString();
// const uid = 'LP-'+tym;
const uid = 'LP'+tym.slice(5,10);
adata.forEach(element => {
  db.query(
    "INSERT INTO `b_transaction`(`date`,`inv_id`, `lc_no`, `v_no`, `ind_weight`, `b_weight`, `type`, `others_c`,`posted`) VALUES (?,?,?,?,?,?,?,?,?)",
    [element.date,uid, element.lc_id, element.v_no, element.ind_w,element.bhu_w,element.type,'LC_PUR','Apu'],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
      }
    }
  );
});
res.send("Values Inserted");
});


app.get("/lcpurchsasedata", (req, res) => {
  
  db.query("SELECT (b_transaction.inv_id),date,others_c,lc_account.lc_name,count(b_transaction.v_no) as vehicle,FORMAT(sum(b_transaction.ind_weight),3) as ind_weight,FORMAT(sum(b_transaction.b_weight),3) as b_weight,b_transaction.posted FROM b_transaction INNER JOIN lc_account ON b_transaction.lc_no = lc_account.id where b_transaction.trash=0 and b_transaction.others_c !='SIDE_PUR'  GROUP BY b_transaction.inv_id ORDER BY b_transaction.id DESC", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});


app.put("/selectlcpurchase", (req, res) => {
  const id = req.body.id;
  console.log(id);
  db.query("SELECT (b_transaction.id),lc_account.lc_name,b_transaction.lc_no,b_transaction.type,b_transaction.ind_weight as ind_w,b_transaction.b_weight as bhu_w,b_transaction.v_no FROM `b_transaction` INNER join lc_account on b_transaction.lc_no=lc_account.id WHERE b_transaction.trash=0 and  b_transaction.inv_id = ?",
  [id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/updatelcpurchase", (req, res) => {
  const adata = req.body.adata;
// console.log(adata);
adata.forEach(element => {
  db.query(
    "UPDATE `b_transaction` SET `v_no`=?,`ind_weight`=?,`b_weight`=?,`type`=? WHERE id=?",
    [element.v_no, element.ind_w,element.bhu_w,element.type,element.id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
      }
    }
  );
});
res.send("Values Inserted");
});

app.put("/deletecart", (req, res) => {
  const side = req.body.side;
  const id = req.body.adata;
 if (side !=0){
  db.query(
    "UPDATE b_transaction SET trash = 1 WHERE id= ?",
    [side],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // res.send(result);
      }
    }
  );

  db.query(
    "UPDATE b_transaction SET trash = 1 WHERE id= ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
 } else {
  db.query(
    "UPDATE b_transaction SET trash = 1 WHERE id= ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
 }

});

app.put("/deleteLcpurchase", (req, res) => {
  const id = req.body.id;
  console.log(id);
  db.query(
    "UPDATE b_transaction SET trash = 1 WHERE inv_id= ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
 
});





/////////////////////////
//lcsell/////////////////
////////////////////////


app.get("/getlcpurv", (req, res) => {
  db.query("SELECT id,v_no,lc_no,type,cart FROM `b_transaction` WHERE others_c='LC_PUR'", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});



app.put("/getslpvehicle", (req, res) => {
  const id = req.body.id;
  const con = req.body.country;
  console.log(con);
  db.query("update `b_transaction` set cart=!cart WHERE id = ?",
  [id])
  db.query("SELECT id,v_no,type,ind_weight,b_weight FROM `b_transaction` WHERE id = ?",
  [id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      
      res.send(result);
    }
  });
});


app.post("/lcsell", (req, res) => {
  const adata = req.body.adata;
  const actype = req.body.actype;
  const tym= new Date().getTime().toString();
// const uid = 'LP-'+tym;
console.log(`dhi iam`+actype);
const uid = 'LS'+tym.slice(5,10);
if(actype=='SIDE'){


//sidepurchase
adata.forEach(element => {
  db.query(
    "INSERT INTO `b_transaction`(`date`,`inv_id`, `lc_no`, `v_no`, `ton`, `cft`, `type`,`rate`,`total`, `client_id`,`payment`,`receive`,`comments`,`others_c`,`side`,`posted`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [element.date,uid, element.lc_id, element.v_no, element.ton,element.ton * 22,element.type,element.rate/22,element.total,element.lc_id,'0',element.total,element.lc_name,'SIDE_PUR',element.client_id,'Apu'],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`ia m insert`+result.insertId);
        const insert_id= result.insertId;
        db.query(
          "INSERT INTO `b_transaction`(`date`,`inv_id`, `lc_no`, `v_no`, `ind_weight`, `b_weight`, `type`,`rate`,`total`, `client_id`,`payment`,`receive`,`comments`,`others_c`,`side`,`posted`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [element.date,uid, element.lc_id, element.v_no, element.ind_w,element.bhu_w,element.type,element.rate,element.total,element.client_id,element.total,'0',element.particular,'LC_SELL',insert_id,'Apu'],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
            }
          }
        );
      }
    }
  );
});

//lcsell
// adata.forEach(element => {
//   db.query(
//     "INSERT INTO `b_transaction`(`date`,`inv_id`, `lc_no`, `v_no`, `ind_weight`, `b_weight`, `type`,`rate`,`total`, `client_id`,`payment`,`receive`,`comments`,`others_c`,`side`,`posted`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//     ['2022-01-01',uid, element.lc_id, element.v_no, element.ind_w,element.bhu_w,element.type,element.rate,element.total,element.client_id,element.total,'0',element.particular,'LC_SELL',insert_id,'Apu'],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//       }
//     }
//   );
// });



} else {
  adata.forEach(element => {
    db.query(
      "INSERT INTO `b_transaction`(`date`,`inv_id`, `lc_no`, `v_no`, `ind_weight`, `b_weight`, `type`,`rate`,`total`, `client_id`,`payment`,`receive`,`comments`,`others_c`,`posted`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [element.date,uid, element.lc_id, element.v_no, element.ind_w,element.bhu_w,element.type,element.rate,element.total,element.client_id,element.total,'0',element.particular,'LC_SELL','Apu'],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
        }
      }
    );
  });
}

res.send("jj");
});

app.put("/selectlcsell", (req, res) => {
  const id = req.body.id;
  console.log(id);
  db.query("SELECT (b_transaction.id),b_transaction.inv_id,accounts.name,lc_account.lc_name,b_transaction.client_id,b_transaction.lc_no,b_transaction.rate,b_transaction.total,(b_transaction.total /b_transaction.rate)as ton,(b_transaction.comments)as particular,b_transaction.type,b_transaction.ind_weight as ind_w,b_transaction.b_weight as bhu_w,b_transaction.v_no,b_transaction.side  FROM `b_transaction` INNER join lc_account on b_transaction.lc_no=lc_account.id INNER JOIN accounts ON b_transaction.client_id=accounts.id WHERE b_transaction.trash=0 and b_transaction.others_c!='SIDE_PUR' and b_transaction.inv_id =?",
  [id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/updatelcsell", (req, res) => {
  const adata = req.body.adata;
console.log(adata);
adata.forEach(element => {
  const side = req.body.adata[0].side;
  if(side!=0){
    //editsidepur
    db.query(
      "UPDATE `b_transaction` set `v_no`=?, `ton`=?, `cft`=?, `type`=?,`rate`=?,`total`=?, `client_id`=?,`payment`=?,`receive`=?,`comments`=? where id = ?",
      [element.v_no, element.ton,element.ton * 22,element.type,element.rate/22,element.total,element.lc_no,'0',element.total,element.particular,side],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
        }
      }
    );
    //editlcsell

    db.query(
      "UPDATE `b_transaction` SET `v_no`=?,`ind_weight`=?,`b_weight`=?,`rate`=?,`total`=?,`client_id`= ?,`payment`=?,`receive`=?,`comments`=?,`type`=? WHERE id=?",
      [element.v_no, element.ind_w,element.bhu_w,element.rate,element.total,element.client_id,element.total,'0',element.particular,element.type,element.id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
        }
      }
    );


  } else{
//editlcsell
    db.query(
      "UPDATE `b_transaction` SET `v_no`=?,`ind_weight`=?,`b_weight`=?,`rate`=?,`total`=?,`client_id`=?,`payment`=?,`receive`=?,`comments`=?,`type`=? WHERE id=?",
      [element.v_no, element.ind_w,element.bhu_w,element.rate,element.total,element.client_id,element.total,'0',element.particular,element.type,element.id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
        }
      }
    );

  }










});
res.send("Values Inserted");
});


///custledger
app.get("/pdf", (req, res)  => {
  var file = fs.createReadStream("./pdf/pdf1.pdf");
   file.pipe(res);

});

app.put("/l"),(req,res)=>{
  console.log('lll');
  const ledData = req.body.adata;
const currDate = ledData.from_date;
var yesterday = new Date(currDate);
const d1=yesterday.setDate(yesterday.getDate()-1);
// const d2 = yesterday.toLocaleDateString('en-CA');

db.query("SELECT sum(payment-receive) from b_transaction  WHERE client_id= ? and date BETWEEN ? and ? and trash=0",
[ledData.client_id,ledData.from_date,d1],
(err, result) => {
  if (err) {
    console.log(err);
  } else {
    res.send(result);
    console.log('i am due');
  }
});
}


app.put("/getpdues", (req, res) => {
  const ledData = req.body.adata;
  const currDate = ledData.from_date;
  var yesterday = new Date(currDate);
  const d1=yesterday.setDate(yesterday.getDate()-1);
  
  const d2 = yesterday.toLocaleDateString('en-CA');
  console.log(d2);
  
  db.query("SELECT COALESCE(sum(payment-receive),0) as due from b_transaction  WHERE client_id= ? and date BETWEEN ? and ? and trash=0",
  [ledData.client_id,'2010-05-05',d2],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(result);
      res.send(result);
    }
  });
  
  });
  //hhh

app.put("/getstatement", (req, res) => {
const ledData = req.body.adata;
const currDate = ledData.from_date;
var yesterday = new Date(currDate);
const d1=yesterday.setDate(yesterday.getDate()-1);
// const d2 = yesterday.toLocaleDateString('en-CA');

// db.query("SELECT sum(payment-receive) from b_transaction  WHERE client_id= ? and date BETWEEN ? and ? and trash=0",
// [ledData.client_id,ledData.from_date,d1],
// (err, result) => {
//   if (err) {
//     console.log(err);
//   } else {
//     res.send(result);
//   }
// });

// console.log(d2);
// console.log(ledData);
db.query("SELECT date,inv_id,v_no,ton,cft,ind_weight,b_weight,type,rate,total,others_c,payment,receive,chalan,comments FROM `b_transaction` WHERE client_id= ? and date BETWEEN ? and ? and trash=0",
[ledData.client_id,ledData.from_date,ledData.to_date],
(err, result) => {
  if (err) {
    console.log(err);
  } else {
    res.send(result);
  }
});

});


///////////////
//////sidesellpur
///////////////
app.get("/sidelist", (req, res) => {
  
  db.query("SELECT * FROM `accounts` WHERE shead='SIDE' AND status=0 order by id desc", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.post("/allsell", (req, res) => {
  const adata = req.body.adata;

  // const gdata = unformat(req.body.adata.g_total);
   const ld_un = req.body.adata.ld_un;
  const trans = req.body.adata.transport;
  const paid = req.body.adata.paid;
  const tym= new Date().getTime().toString();
  const uid = 'AS'+tym.slice(5,10);
  const selltyp =  req.body.adata.sell_type;
// console.log(gdata);
  if(selltyp=='PUR'){
     pay = req.body.adata.total;
     rec = '0';
  }else{
     pay = '0';
     rec = req.body.adata.total;
  }
 
  // const insert_id= result.insertId;
// console.log(rec);

  db.query(
    "INSERT INTO `b_transaction`(`date`, `inv_id`,`insert_id`, `v_no`, `ton`, `cft`, `type`, `rate`, `total`,`ld_un`,`transport`,`paid`,`g_total`, `client_id`, `payment`, `receive`, `chalan`, `comments`,`bill_type`, `sell_type`, `inventory`,   `others_c`, `side`,`side_name`, `posted`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [adata.date,uid,'',adata.v_no,adata.ton,adata.cft,adata.size,adata.rate,adata.total,ld_un,trans,paid,adata.g_total,adata.client_id,pay,rec,adata.chalan,adata.particular,adata.bill_type,adata.sell_type,adata.inventory,'ALLSP',adata.side,adata.side_name,'JAYED'],
    (err, result) => {
      if (err) {
       console.log(err)
      } else {
        

 const insert_id= result.insertId;
console.log(insert_id);




if(ld_un!=0){
  // load unload ac theke receive
  db.query(
    "INSERT INTO `b_transaction`(`date`, `inv_id`,`insert_id`, `client_id`, `payment`, `receive`, `chalan`, `comments`,  `others_c`, `posted`) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [adata.date,uid,insert_id,adata.client_id,0,adata.ld_un,adata.chalan,'Load/Unload','ITRANL','JAYED'],
    (err, result) => {
      if (err) {
       console.log(err)
      } else {
        // res.send("done");
      }
    }
  );
  
  //customer e payment
  db.query(
    "INSERT INTO `b_transaction`(`date`, `inv_id`,`insert_id`, `client_id`, `payment`, `receive`, `chalan`, `comments`,  `others_c`, `posted`) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [adata.date,uid,insert_id,adata.client_id,adata.ld_un,0,adata.chalan,'Transpot','ITRANC','JAYED'],
    (err, result) => {
      if (err) {
       console.log(err)
      } else {
        // res.send("done");
      }
    }
  );
  
  
  } 
  if(trans!=0){
  
    db.query(
      "INSERT INTO `b_transaction`(`date`, `inv_id`,`insert_id`, `client_id`, `payment`, `receive`, `chalan`, `comments`,  `others_c`, `posted`) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [adata.date,uid,insert_id,adata.client_id,0,adata.transport,adata.chalan,adata.particular,'ITRANT','JAYED'],
      (err, result) => {
        if (err) {
         console.log(err)
        } else {
          // res.send("done");
        }
      }
    );
    
    // customer e payment
    db.query(
      "INSERT INTO `b_transaction`(`date`, `inv_id`,`insert_id`, `client_id`, `payment`, `receive`, `chalan`, `comments`,  `others_c`, `posted`) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [adata.date,uid,insert_id,adata.client_id,adata.transport,0,adata.chalan,adata.particular,'ITRANC','JAYED'],
      (err, result) => {
        if (err) {
         console.log(err)
        } else {
          // res.send("done");
        }
      }
    );
  
  
  }
  
  if(paid!=0){   
    // customer e payment
    db.query(
      "INSERT INTO `b_transaction`(`date`, `inv_id`,`insert_id`, `client_id`, `payment`, `receive`, `chalan`, `comments`,  `others_c`, `posted`) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [adata.date,uid,insert_id,adata.client_id,0,adata.paid,adata.chalan,adata.particular,'ITRANP','JAYED'],
      (err, result) => {
        if (err) {
         console.log(err)
        } else {
          // res.send("done");
        }
      }
    );
    
  
  }






res.send(result);







      }
    }
  );



});


app.get("/allselldata", (req, res) => {
  
  db.query("SELECT b_transaction.*,accounts.name FROM `b_transaction` INNER JOIN accounts ON accounts.id=b_transaction.client_id WHERE  trash=0", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(result);
      res.send(result);
    }
  });
});

app.get("/alllcpurdata", (req, res) => {
  
  db.query("SELECT b_transaction.*,lc_account.lc_name FROM `b_transaction` INNER join lc_account on lc_account.id=b_transaction.lc_no WHERE  b_transaction.trash=0", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(result);
      res.send(result);
    }
  });
});


app.put("/selectselldata", (req, res) => {
  const id = req.body.id;
  console.log(id);
  db.query("SELECT b_transaction.*,accounts.name FROM `b_transaction` INNER JOIN accounts ON accounts.id=b_transaction.client_id WHERE b_transaction.id=?",
  [id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      
      res.send(result);
    }
  });
});





app.post("/allsellupdate", (req, res) => {
  const adata = req.body.adata;
  // const gdata = unformat(req.body.adata.g_total);
   const ld_un = req.body.adata.ld_un;
  const trans = req.body.adata.transport;
  const paid = req.body.adata.paid;
  const tym= new Date().getTime().toString();
  const uid = 'AS'+tym.slice(5,10);
  const selltyp =  req.body.adata.sell_type;
  const billtyp =  req.body.adata.bill_type;
//  console.log(req.body.adata);
  if(selltyp=='SELL'){
     pay = req.body.adata.total;
     rec = '0';
  }else{
     pay = '0';
     rec = req.body.adata.total;
  }
 
  // const insert_id= result.insertId;
// console.log(rec);

  db.query(
    "update `b_transaction` set v_no=? ,ton=?, cft=?,type=?,rate=?,total=?,ld_un=?,transport=?,paid=?,g_total=?,payment=?,receive =?,chalan=?,comments=? where  id =?",
    [adata.v_no,adata.ton,adata.cft,adata.size,adata.rate,adata.total,ld_un,trans,paid,adata.g_total,pay,rec,adata.chalan,adata.particular,adata.id],
    (err, result) => {
      if (err) {
       console.log(err)
      } else {
        

//  const insert_id= result.insertId;
// console.log(insert_id);




if(ld_un!=0){


  db.query(
    "select id from b_transaction where  insert_id =? and others_c='ITRANL'",
    [adata.id],
    (err, result) => {
      if (err) {
       console.log(err)
      } else {
       const ldun_id = result[0].id;
       // load unload ac theke receive
  db.query(
    "update b_transaction set payment=?,receive=?,chalan=?,comments=? where  id =?",
    [0,ld_un,adata.chalan,adata.particular,ldun_id],
    (err, result) => {
      if (err) {
       console.log(err)
      } else {
      //  console.log(rec);
      }
    }
  );
  
  //customer e payment
  db.query(
    "update b_transaction set payment=?,receive=?,chalan=?,comments=? where  id =?",
    [ld_un,0,adata.chalan,adata.particular,ldun_id+1],
    (err, result) => {
      if (err) {
       console.log(err)
      } else {
        // console.log(pay);
        // res.send("done");
      }
    }
  );
  
  
      }
    }
  );

  
  } 
  if(trans!=0){
  
    db.query(
      "select id from b_transaction where  insert_id =? and others_c='ITRANT'",
      [adata.id],
      (err, result) => {
        if (err) {
         console.log(err)
        } else {
         const transp_id = result[0].id;
         // load unload ac theke receive
    db.query(
      "update b_transaction set payment=?,receive=?,chalan=?,comments=? where  id =?",
      [0,trans,adata.chalan,adata.particular,transp_id],
      (err, result) => {
        if (err) {
         console.log(err)
        } else {
        //  console.log(rec);
        }
      }
    );
    
    //customer e payment
    db.query(
      "update b_transaction set payment=?,receive=?,chalan=?,comments=? where  id =?",
      [trans,0,adata.chalan,adata.particular,transp_id+1],
      (err, result) => {
        if (err) {
         console.log(err)
        } else {
          console.log(pay);
          // res.send("done");
        }
      }
    );
    
    
        }
      }
    );
  
  
  
  }
  






res.send(result);







      }
    }
  );



});


///delete all inv

app.put("/deletesellb2", (req, res) => {
  // const id = req.body.id;
  const id = req.body.id;
  console.log(id);
  db.query(
    "UPDATE b_transaction SET trash = 1 WHERE id= ? and insert_id =?",
    [id,id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});













////////////////finalaccount////////////////
///////////////////////////////////////////

app.put("/getfinalac", (req, res) => {
  const id = req.body.id;
  console.log(id);
  db.query("SELECT b_transaction.*,accounts.name FROM `b_transaction` INNER JOIN accounts ON accounts.id=b_transaction.client_id WHERE b_transaction.id=?",
  [id],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      
      res.send(result);
    }
  });
});




// app.put("/openurl", (req, res) => {
//   const id = req.body.adata;
//   console.log(id);
//   db.query("SELECT b_transaction.*,accounts.name FROM `b_transaction` INNER JOIN accounts ON accounts.id=b_transaction.client_id WHERE b_transaction.id=?",
//   [id],
//   (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
      
//       res.send(result);
//     }
//   });
// });

app.put("/getlcsellfc", (req, res) => {
  const date = req.body.adata;
  console.log(date);
  db.query("SELECT accounts.name,b_transaction.total FROM `b_transaction` INNER JOIN accounts ON b_transaction.client_id=accounts.id  WHERE b_transaction.`others_c`='LC_SELL' AND b_transaction.date=? AND b_transaction.trash=0",
  [date],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      
      res.send(result);
    }
  });
});


app.put("/getallsellfc", (req, res) => {
  const date = req.body.adata;
  console.log(date);
  db.query("SELECT accounts.name,b_transaction.total,b_transaction.bill_type,b_transaction.sell_type,b_transaction.inventory FROM `b_transaction` INNER JOIN accounts ON b_transaction.client_id=accounts.id WHERE b_transaction.`others_c`='ALLSP'  AND b_transaction.trash=0",
  [date],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      
      res.send(result);
      // console.log(result);
    }
  });
});



app.put("/getalltranfc", (req, res) => {
  const date = req.body.adata;
  console.log(date);
  db.query("SELECT accounts.name,b_transaction.total,b_transaction.bill_type,b_transaction.sell_type,b_transaction.inventory FROM `b_transaction` INNER JOIN accounts ON b_transaction.client_id=accounts.id WHERE b_transaction.`others_c`='ALLSP'  AND b_transaction.trash=0",
  [date],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      
      res.send(result);
      // console.log(result);
    }
  });
});




app.listen(3003, () => {
  console.log("Yey, your server is running on port 3007");
});
