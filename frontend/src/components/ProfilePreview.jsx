import React, {useState, useEffect} from "react";
import logo from "../logoKIM.png";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const ProfilePreview = () => {
  const { id } = useParams(); // Deklarasikan id menggunakan useParams
  const [user, setUser] = useState({}); // Tambahkan state user untuk menyimpan data pengguna
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${id}`);
        setUser(response.data); // Simpan data pengguna dalam state user
        setPreview(response.data.url);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getUserById();
  }, [id]);
  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-8">
          <div className="box">
            <div className="columns">
              <div className="column is-4">
              {preview ? (
                <figure className="image is-128x128">
                  <img src={preview} alt="User Profile" />
                </figure>
              ) : (
              ""
              )}
              </div>
              <div className="column is-8">
                <h1 className="title">{user.name}</h1>
                <h2 className="subtitle">{user.tgl_lahir}</h2>
              </div>
            </div>
            <div className="card">
              <div className="card-content">
                <div className="content">
                  <h2 className="subtitle">Personal Information</h2>
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        value={user.email}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">No HP</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        value={user.no_hp}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Alamat</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        value={user.alamat}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <Link
                  to={`/profile/edit/${user.uuid}`}
                  className="button is-small is-success"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
