const CheckEmailHandle = (email, handle) => {
  return [
    {
      $facet: {
        emailCheck: [
          { $match: { email } },
          { $limit: 1 }, // Limita o resultado para melhorar performance
        ],
        handleCheck: [
          { $match: { handle } },
          { $limit: 1 }, // Limita o resultado para melhorar performance
        ],
      },
    },
    {
      $project: {
        emailExists: { $gt: [{ $size: "$emailCheck" }, 0] },
        handleExists: { $gt: [{ $size: "$handleCheck" }, 0] },
      },
    },
  ];
};

module.exports = CheckEmailHandle;
