'use client'

// import Link from "next/link";
import { nodes } from "./linkSidebar";
import { FiChevronRight } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getVendorId } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Node = {
    name: string;
    url: string;
    nodes?: Node[];
    icon?: JSX.Element;
};

// type Service = {
//     name: string;
//     url: string;
// };

type FetchResponse = {
    status: boolean;
    data: { service_id: { name: string } }[]; // Adjust type according to your actual response structure
};

export default function Sidebar({
    isOpen,
    toggleSidebar,
    role,
}: {
    isOpen: boolean;
    toggleSidebar: () => void;
    role: string;
}) {
    const [services, setServices] = useState<Node[]>([]);
    // const [loading, setLoading] = useState(true);
    const vendor_id = getVendorId();

    // Fetch services dynamically
    useEffect(() => {
        const fetchServices = async () => {
            try {

                const response = await fetch(`${process.env.baseUrl}/admin/vendor-service-lists?vendor_id=${vendor_id}`);
                const result: FetchResponse = await response.json();

                if (result.status && Array.isArray(result.data)) {
                    const fetchedServices = result.data.map((item) => ({
                        name: item.service_id.name,
                        url: `/dashboard/services/${item.service_id.name}`,
                    }));

                    setServices(fetchedServices);
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
            // finally {
            //     setLoading(false);
            // }
        };

        fetchServices();
    }, [vendor_id]);

    // Filter nodes based on role
    const filteredNodes = nodes.filter((node) => {
        if (role === "procurement") {
            return node.name === "Dashboard" || node.name === "Providers" || node.name === "EPOD";
        }
        if (role === "client") {
            // return node.name === "Dashboard" || node.name === "Services";
            return node.name === "Dashboard" || node.name === "Services" || node.name === "Others";//added code for role

        }
        if (role === "user") {
            return node.name === "Dashboard" || node.name === "Catalogue Management";
        }
        if (role === "super_admin") {
            return node.name !== "Services" && node.name !== "Catalogue Management" && node.name !== "Others";
        }
    });

    // Add fetched services dynamically under the "Services" node
    const enhancedNodes = filteredNodes.map((node) => {
        if (node.name === "Services") {
            return {
                ...node,
                nodes: services,
            };
        }
        return node;
    });

    return (
        <div
            className={`fixed top-0 bottom-0 left-0 w-64 p-2 mt-[65px] max-h-full overflow-y-scroll shadow-md custom-scrollbar bg-white transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
        >
            <ul>
                {enhancedNodes.map((node) => (
                    <FilesystemItem
                        node={node}
                        key={node.name}
                        toggleSidebar={toggleSidebar}
                    />
                ))}
            </ul>
        </div>
    );
}

function FilesystemItem({
    node,
    toggleSidebar,
}: {
    node: Node;
    toggleSidebar: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter(); // Use the router for navigation

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const navigateToService = (url: string) => {
        router.push(url);
        if (window.innerWidth < 768) toggleSidebar(); // Close sidebar on smaller screens
    };

    return (
        <li className="mb-4">
            <div className="flex justify-between items-center hover:text-orange-500 rounded-md cursor-pointer">
                <span
                    onClick={(e) => {
                        if (node.nodes && node.nodes.length > 0) {
                            e.preventDefault(); // Prevent navigation if there are child nodes
                            handleToggle();
                        } else {
                            navigateToService(node.url); // Navigate if there are no child nodes
                            if (window.innerWidth < 768) toggleSidebar();
                        }
                    }}
                    className="flex items-center gap-3 text-[14px] font-medium pl-5"
                >
                    {node.icon}
                    <span className="text-[15px] font-medium">{node.name}</span>
                </span>
                {node.nodes && node.nodes.length > 0 && (
                    <button onClick={handleToggle} className="p-1 -ml-1">
                        <FiChevronRight
                            className={`size-4 text-gray-500 hover:text-orange-500 ${isOpen ? "rotate-90" : ""}`}
                        />
                    </button>
                )}
            </div>
            <div
                className={`overflow-hidden transition-max-height duration-1000 ease-in-out`}
                style={{
                    maxHeight: isOpen && node.nodes ? `${node.nodes.length * 40}px` : "0px",
                }}
            >
                <ul className="mt-3 text-[12px] text-gray-600 font-light">
                    {node.nodes?.map((childNode) => (
                        <FilesystemItem
                            node={childNode}
                            key={childNode.name}
                            toggleSidebar={toggleSidebar}
                        />
                    ))}
                </ul>
            </div>
        </li>
    );

}


