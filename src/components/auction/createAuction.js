import "./createAuction.css";

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Explore1Item from "../explore/explore1/explore1Item";

import Input1 from "../../basic/button/input1";
// import ClockImg from "../../assets/item/clock.png";
import TagImg from "../../assets/item/tag.png";
// import PeopleImg from "../../assets/item/people.png";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateAccount } from "../../redux/blockchain/blockchainActions";
import { useNavigate } from "react-router-dom";
import Web3EthContract from "web3-eth-contract";
// import AkachiToken from "../../contracts/AkachiToken.json";
import EliteChess from "../../contracts/EliteChess.json"
function CreateAuction(props) {
  const [data, setData] = useState([]);
  const [owner, setOwner ] = useState("")
  const [buyNow, setBuyNow] = useState(0);
  const [minPrice, setMinPrice ] = useState(0);

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [firstLoad, setFirstLoad] = useState(true);

  const onCreateAuction = () => {
    console.log(minPrice, buyNow)
    const erc721Contract = new Web3EthContract ( 
      EliteChess, 
      "0x26D4025EA3B66EA8987B1b1F9B23F9AfCA1eFe11"
     )
     // approve auction contract
    erc721Contract.methods
      .setApprovalForAll("0x35A2cf15fD8Ba25b5aA6552A972F2a0642CEF197", true)
      .send({from: blockchain.account})
      .once("error", err=>{
        console.log(err)
      })
      .then(() =>{
        console.log("success");
      })
    blockchain.smartContract.methods
      .createDefaultNftAuction(props.contract, props.id, blockchain.web3.utils.toWei(minPrice, "ether")  , blockchain.web3.utils.toWei(buyNow, "ether") )
      .send({from: blockchain.account})
      .once("error", err=>{
        console.log(err)
      })
      .then(() =>{
        dispatch(updateAccount());
        console.log("success");
        navigate("/auction")
      })
  }
  useEffect(() => {
    if (firstLoad) {
      // console.log(props);
      if (blockchain.account === null) {
        navigate("/");
      }
      const url =
        "https://testnets-api.opensea.io/api/v1/assets?token_ids="+props.id + "&asset_contract_address=" +
        props.contract +
        "&offset=0&limit=200";
      axios.get(url).then((res) => {
        console.log(res);
        setData(res.data.assets[0])  
        if (res.data.assets[0].owner.address.length> 15)
          setOwner(res.data.assets[0].owner.address.substring(0, 12) + "...")
        else
         setOwner(res.data.assets[0].owner.address)
      });
      setFirstLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoad]);
  return (
    <div className="createAuction-layout">
      <Container>
        <Row>
          <Col lg="4">
            <h2 className="createAuction-title">Preview item</h2>
            <Explore1Item
              title={data.name}
              image = {data.image_url}
              net="BSC"
              owner={owner}
              // .length > 12 ? 
              //   data.creator.address.substring(0, 10) + "..." :
              //    data.creator.address}
              // price="Current Bid"
              // priceItem="4.89ETH"
              bidding={false}
              navable= {false}
            />
          </Col>
          <Col lg="8">
            <h2 className="createAuction-title">Select method</h2>
            <Row>
              <Col lg="8">
                <button className="createAuction-method selected">
                  <img src={TagImg} alt="" className="button-img" />
                  Fixed Price
                </button>
              </Col>
              {/* <Col lg="4">
                <button className="createAuction-method">
                  <img src={ClockImg} alt="" className="button-img" />
                  Fixed Price
                </button>
              </Col>
              <Col lg="4">
                <button className="createAuction-method">
                  <img src={PeopleImg} alt="" className="button-img" />
                  Fixed Price
                </button>
              </Col> */}
            </Row>
            <h2 className="createAuction-title">Min Price</h2>
            <Input1 margin="1em" text="Enter minimum price for one item (AkachiToken)" value = {minPrice} onChange = {(e)=>setMinPrice(e.target.value)}/>
            <h2 className="createAuction-title">Buy Now</h2>
            <Input1 margin="1em" text="Enter buy now price for one item (AkachiToken)" value = {buyNow} onChange = {(e)=>setBuyNow(e.target.value)}/>
            {/* <h2 className="createAuction-title">Title</h2>
            <Input1 margin="1em" text="Item Name" />
            <h2 className="createAuction-title">Description</h2>
            <textarea
              className="blogDetails-input1"
              type="text"
              placeholder='e.g "This is very limited item"'
            />
            <Row>
              <Col lg="8">
                <h2 className="createAuction-title">External Link</h2>
                <input
                  placeholder="https://yoursite.com"
                  className="createAuction-input"
                />
              </Col>

              <Col lg="4">
                <h2 className="createAuction-title">Collection</h2>
                <select className="explore1Comp-select">
                  <option>All Artworks</option>
                  <option>Music</option>
                  <option>Domain Names</option>
                  <option>Virtual World</option>
                  <option>Trading Cards</option>
                  <option>Sports</option>
                  <option>Utility</option>
                </select>
              </Col>
            </Row> */}
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <button className="createAuction-create-btn" onClick={() => onCreateAuction()}>Start Auction</button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default CreateAuction;