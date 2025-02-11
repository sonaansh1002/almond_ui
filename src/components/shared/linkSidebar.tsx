"use client";

import { RdIcon } from "./icons";

type Node = {
    name: string;
    url: string;
    nodes?: Node[];
    icon?: JSX.Element;
};


export const nodes: Node[] = [
    {
        name: "Dashboard",
        url: "/dashboard",
        icon: <RdIcon iconName="homeicon" />, // this is imported icon component 

    },
    {
        name: "Transactions",
        url: "",
        icon: <RdIcon iconName="userfriends" />,
        nodes: [
            {
                name: "All Transactions",
                url: "/dashboard/transactions",
                icon: <RdIcon iconName="dot" />,

            },]
    },
    {
        name: "Orders",
        url: "",
        icon: <RdIcon iconName="image" />,

    },
    {
        name: "Customer Management",
        url: "",
        icon: <RdIcon iconName="cog" />,

    },
    {
        name: "User Management",
        url: "",
        icon: <RdIcon iconName="file" />,
        nodes: [
            {
                name: "All Clients",
                url: "/dashboard/client",
                icon: <RdIcon iconName="dot" />,

            },
            {
                name: "Portal Users",
                url: "/dashboard/portalUser",
                icon: <RdIcon iconName="dot" />,

            },
            {
                name: "Role Management",
                url: "/dashboard/createRole",
                icon: <RdIcon iconName="dot" />,

            },
            {
                name: "Permission Management",
                url: "",
                icon: <RdIcon iconName="dot" />,

            },
        ]
    },
    {
        name: "Voucher Management",
        url: "",
        icon: <RdIcon iconName="folder" />,
        nodes: [
            {
                name: "Self Vouchers",
                url: "",
                icon: <RdIcon iconName="dot" />,

            },
            {
                name: "Upload Self Vouchers",
                url: "",
                icon: <RdIcon iconName="dot" />,

            },
            {
                name: "Vouchers Redemption",
                url: "",
                icon: <RdIcon iconName="dot" />,

            },

        ],
    },
    {
        name: "Products Management",
        url: "",
        icon: <RdIcon iconName="cartcheck" />,
        nodes: [
            {
                name: "Products",
                url: "/dashboard/product",
                icon: <RdIcon iconName="dot" />,

            },
            // {
            //     name: "Catalogue",
            //     url: "/dashboard/catalogue",
            //     icon: <RdIcon iconName="dot" />,

            // },
            {
                name: "Brands",
                url: "/dashboard/brands",
                icon: <RdIcon iconName="dot" />,

            },
            {
                name: "Categories",
                url: "",
                icon: <RdIcon iconName="dot" />,

            },
        ],
    },
    {
        name: "Order Management",
        url: "",
        icon: <RdIcon iconName="file" />,
        nodes: [
            {
                name: "Stock List",
                url: "",
                icon: <RdIcon iconName="dot" />,
                nodes: [

                    {
                        name: "Stock History",
                        url: "/dashboard/client",
                        icon: <RdIcon iconName="dot" />,

                    },
                    {
                        name: "Stock Transfer",
                        url: "",
                        icon: <RdIcon iconName="dot" />,

                    },
                    {
                        name: "Stock Transfer History",
                        url: "",
                        icon: <RdIcon iconName="dot" />,

                    },
                    {
                        name: "Damage Stock",
                        url: "",
                        icon: <RdIcon iconName="dot" />,

                    },

                ]
            },
            {
                name: "Portal Users",
                url: "/dashboard/client",
                icon: <RdIcon iconName="dot" />,

            },
        ]
    },
    {
        name: "Distpatch List",
        url: "",
        icon: <RdIcon iconName="filepdf" />,
        nodes: [
            {
                name: "Dispatch Order",
                url: "/program-Guide_Header",
                icon: <RdIcon iconName="dot" />,

            },
            {
                name: "Dispatch History",
                url: "/program-Guide_grid",
                icon: <RdIcon iconName="dot" />,

            },
        ],
    },
    {
        name: "Suppliers",
        url: "/suppliers",
        icon: <RdIcon iconName="stockfill" />,

    },
    {
        name: "Warehouse",
        url: "/warehouse",
        icon: <RdIcon iconName="redeem" />,

    },
    {
        name: "Providers",
        url: "/dashboard/providers",
        icon: <RdIcon iconName="file" />,
    },
    {
        name: "To find the Activation",
        url: "",
        icon: <RdIcon iconName="vmactive" />,

        nodes: [
            {
                name: "Card Number API ",
                url: "",
                icon: <RdIcon iconName="dot" />,

            }
        ]
    },
    {
        name: "EPOD",
        url: "/dashboard/epod",
        icon: <RdIcon iconName="filepdf" />,
    },
    {
        name: "Services",
        url: "",
        icon: <RdIcon iconName="filepdf" />,

    },
    {
        name: "Others",
        url: "",
        icon: <RdIcon iconName="filepdf" />,
        nodes: [
            {
                name: "All Services",
                url: "/dashboard/clientService",
                icon: <RdIcon iconName="dot" />,

            },
            {
                name: "All Transcations",
                url: "/dashboard/clientTransactions",
                icon: <RdIcon iconName="dot" />,

            },
        ],
    },
    {
        name: "Catalogue Management",
        url: "",
        icon: <RdIcon iconName="cartcheck" />,
        nodes: [
            {
                name: "Products",
                url: "/dashboard/product",
                icon: <RdIcon iconName="dot" />,

            },
            {
                name: "Catalogue",
                url: "/dashboard/catalogue",
                icon: <RdIcon iconName="dot" />,
            },

        ],
    },
]










