import React, { useState, useMemo } from "react";
import { Plus, Users2, Eye, Edit, UserPlus, Search, Filter, ChevronLeft, ChevronRight, Target } from "lucide-react";

const TeamsSection = ({ teams, departments, users, onCreateTeam }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter and sort teams
  const filteredAndSortedTeams = useMemo(() => {
    let filtered = teams.filter(team =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departments.find(dept => dept.id === team.departmentId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "department":
          aValue = departments.find(dept => dept.id === a.departmentId)?.name.toLowerCase() || '';
          bValue = departments.find(dept => dept.id === b.departmentId)?.name.toLowerCase() || '';
          break;
        case "members":
          aValue = users.filter(user => user.teamId === a.id).length;
          bValue = users.filter(user => user.teamId === b.id).length;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [teams, departments, users, searchTerm, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTeams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeams = filteredAndSortedTeams.slice(startIndex, endIndex);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className="px-3 py-2 text-sm text-gray-500">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            currentPage === i
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className="px-3 py-2 text-sm text-gray-500">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="space-y-4">
      {/* Compact Header with integrated controls */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title Section */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Team Management</h2>
              <p className="text-sm text-gray-500">Manage teams within departments and their members</p>
            </div>
          </div>
          
          {/* Create Button */}
          <button 
            onClick={onCreateTeam} 
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Team
          </button>
        </div>
        
        {/* Search and Filter Row */}
        <div className="flex flex-col lg:flex-row gap-3 mt-4 pt-4 border-t border-gray-100">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search teams or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-800 text-sm transition-all duration-200 hover:border-purple-300"
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-300"
              >
                <option value="name">Sort by Name</option>
                <option value="department">Sort by Department</option>
                <option value="members">Sort by Members</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Filter className="w-3 h-3 text-gray-400" />
              </div>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-700 text-sm"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
          
          {/* Results Summary */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>
              {startIndex + 1}-{Math.min(endIndex, filteredAndSortedTeams.length)} of {filteredAndSortedTeams.length}
            </span>
            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
              {teams.length} Total
            </span>
          </div>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Team
                    {sortBy === "name" && (
                      <span className="text-purple-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSort("department")}
                >
                  <div className="flex items-center gap-2">
                    Department
                    {sortBy === "department" && (
                      <span className="text-purple-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSort("members")}
                >
                  <div className="flex items-center gap-2">
                    Members
                    {sortBy === "members" && (
                      <span className="text-purple-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTeams.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Users2 className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first team"}
                      </p>
                      {!searchTerm && (
                        <button 
                          onClick={onCreateTeam}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        >
                          <Plus className="w-5 h-5" />
                          Create First Team
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
                          <Users2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{team.name}</div>
                          <div className="text-sm text-gray-500">Team ID: {team.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-200">
                          {departments.find(dept => dept.id === team.departmentId)?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full border border-orange-200">
                          {users.filter(user => user.teamId === team.id).length} members
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 border border-green-200 hover:border-green-300" title="Edit Team">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 border border-orange-200 hover:border-orange-300" title="Add Members">
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Page {currentPage} of {totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {renderPaginationButtons()}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsSection;