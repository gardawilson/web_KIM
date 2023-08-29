import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

const fetcher = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const ProductList = () => {
  const { data: products } = useSWR("http://localhost:5000/products", fetcher);
  const { mutate } = useSWRConfig();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState("");
  const [stockAmount, setStockAmount] = useState(0);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const deleteProduct = async (productId) => {
    await axios.delete(`http://localhost:5000/products/${productId}`);
    mutate("http://localhost:5000/products");
    setShowDetailsModal(false);
  };

  const handleCloseDetailsModal = () => {
    setSelectedProduct(null);
    setShowDetailsModal(false);
  };

  const handleCloseStockModal = () => {
    setSelectedProduct(null);
    setShowStockModal(false);
  };

  const handleStockChange = (event) => {
    setStockAmount(Number(event.target.value));
  };

  const handleStockSubmit = () => {
    // Handle stock submission here
    // You can call an API to update the stock for the selected product
    // Use stockAction and stockAmount to determine whether to add or reduce stock
    // Close the stock modal after submission
    setShowStockModal(false);
  };

  const handleShowDetailsModal = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleShowStockModal = (action, product) => {
    setStockAction(action);
    setSelectedProduct(product);
    setShowStockModal(true);
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">List of Products</h2>
      <Link to="/products/add" className="button is-primary mb-2">
        Add Product
      </Link>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by product name"
        className="input mb-5"
      />
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Product Name</th>
            <th>Stock</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts?.map((product, index) => (
            <tr key={product.uuid}>
              <td>{index + 1}</td>
              <td>
                <button
                  onClick={() => handleShowDetailsModal(product)}
                  className="button is-text"
                  style={{ cursor: "pointer" }}
                >
                  {product.name}
                </button>
              </td>
              <td>{product.stockProduct}</td>
              <td>{product.user.name}</td>
              <td>
                <button
                  onClick={() => handleShowStockModal("add", product)}
                  className="button is-small is-success mr-2"
                >
                  Add Stock
                </button>
                <button
                  onClick={() => handleShowStockModal("reduce", product)}
                  className="button is-small is-danger"
                >
                  Reduce Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDetailsModal && selectedProduct && (
        <div className="modal is-active">
  <div className="modal-background" onClick={handleCloseDetailsModal}></div>
  <div className="modal-card">
    <header className="modal-card-head">
      <p className="modal-card-title">{selectedProduct.name}</p>
      <button
        onClick={handleCloseDetailsModal}
        className="delete"
        aria-label="close"
      ></button>
    </header>
    <section className="modal-card-body">
      <p>Stock: {selectedProduct.stockProduct}</p>
    </section>
    <footer className="modal-card-foot">
    <Link
    to={`/products/edit/${selectedProduct.uuid}`}
    className="button is-small is-info"
  >
    Edit
  </Link>
      <button
        onClick={() => deleteProduct(selectedProduct.uuid)}
        className="button is-small is-danger"
      >
        Delete
      </button>
    </footer>
  </div>
</div>
      )}

      {showStockModal && selectedProduct && (
        <div className="modal is-active">
        <div className="modal-background" onClick={handleCloseStockModal}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">
              {stockAction === "add" ? "Add Stock" : "Reduce Stock"}
            </p>
            <button
              onClick={handleCloseStockModal}
              className="delete"
              aria-label="close"
            ></button>
          </header>
          <section className="modal-card-body">
            <p>Product: {selectedProduct.name}</p>
            <div className="field">
              <label className="label">Amount:</label>
              <div className="control">
                <input
                  type="number"
                  value={stockAmount}
                  onChange={handleStockChange}
                  className="input"
                />
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button onClick={handleStockSubmit} className="button is-primary">
              Confirm
            </button>
          </footer>
        </div>
      </div>      
      )}
    </div>
  );
};

export default ProductList;
