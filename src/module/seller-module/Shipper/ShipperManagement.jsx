import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ShipperManagement = () => {
  const [shippers, setShippers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredShippers, setFilteredShippers] = useState([]);

  const fetchShippers = async () => {
    try {
      const res = await axios.get("/api/shipper");
      setShippers(res.data);
      setFilteredShippers(res.data);
    } catch (error) {
      console.error("Error fetching shippers:", error);
    }
  };

  useEffect(() => {
    fetchShippers();
  }, []);

  useEffect(() => {
    const filtered = shippers.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredShippers(filtered);
  }, [search, shippers]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`/api/shipper/status/${id}`, {
        status: currentStatus === 1 ? 0 : 1,
      });
      fetchShippers();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shipper Management</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShippers.map((shipper) => (
                <TableRow key={shipper.id}>
                  <TableCell>{shipper.id}</TableCell>
                  <TableCell>{shipper.name}</TableCell>
                  <TableCell>{shipper.email}</TableCell>
                  <TableCell>{shipper.phone}</TableCell>
                  <TableCell>
                    {shipper.status === 1 ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => toggleStatus(shipper.id, shipper.status)}
                    >
                      {shipper.status === 1 ? "Disable" : "Enable"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipperManagement;
