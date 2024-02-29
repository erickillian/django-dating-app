import React from "react";
import { Progress, Card } from "antd";

const ProfileCompleteness = ({ completeness }) => {
    const twoColors = {
        "0%": "#108ee9",
        "100%": "#87d068",
    };
    const conicColors = {
        "0%": "#ffccc7",
        "50%": "#ffe58f",
        "100%": "#87d068",
    };

    return (
        <Card title="Profile Completeness">
            <div>
                <Progress
                    percent={completeness}
                    strokeColor={conicColors}
                    size={["large", 30]}
                />
            </div>
        </Card>
    );
};

export default ProfileCompleteness;
